import { NextRequest, NextResponse } from "next/server";
import { generateContentUnified } from "@/lib/gemini";
import { 
  buildEnhancementPrompt, 
  buildCopywritingPrompt, 
  getAspectRatioForFood 
} from "@/lib/prompt-builder";
import { trackUsage, checkCircuitBreaker } from "@/lib/usage-tracker";
import { createClient } from "@/lib/supabase/server";
import { saveUserCreation } from "@/lib/creations";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // 1. Check Circuit Breaker (Financial Safety)
    const safety = await checkCircuitBreaker();
    if (!safety.allowed) {
      return NextResponse.json(
        { error: "Limite de uso diário atingido.", code: "BUDGET_EXCEEDED" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { 
      imagePath, 
      mimeType, 
      foodType, 
      visualStyle, 
      formatSelected = "1:1",
      serviceId,
      referenceId,
      options = { keepAngle: false, keepBackground: false }
    } = body;

    const effectiveReferenceId = referenceId || `kit_${Date.now()}`;

    if (!imagePath || !mimeType || !foodType || !visualStyle || !serviceId) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    // 2. Auth & Credits (ATOMIC SERVER-SIDE VALIDATION)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    // Call RPC to consume credits
    const { data: rpcResponse, error: rpcError } = await supabase.rpc('consume_credits', {
      p_user_id: user.id,
      p_service_id: serviceId,
      p_reference_id: effectiveReferenceId
    });

    if (rpcError) {
      console.error("❌ Credit RPC Error:", rpcError);
      return NextResponse.json({ error: "Erro ao validar seus créditos. Tente novamente." }, { status: 500 });
    }

    const creditResult = rpcResponse as { success: boolean; error?: string; remaining_credits?: number };
    if (!creditResult.success) {
      return NextResponse.json(
        { error: creditResult.error || "Saldo insuficiente de créditos para esta operação." },
        { status: 403 }
      );
    }

    // 3. Download Original Image from Storage (Removing Base64 from Payload)
    console.log(`🚀 Unified Kit Generation: ${foodType} (${visualStyle}) for user ${user.id}`);
    
    const { data: imageBlob, error: downloadError } = await supabase.storage
      .from('creations')
      .download(imagePath);

    if (downloadError || !imageBlob) {
      console.error("❌ Storage Download Error:", downloadError);
      throw new Error("Falha ao recuperar imagem original.");
    }

    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const imageBase64 = imageBuffer.toString('base64');

    // 4. Conditional Generation (Image + Copywriting if needed)
    const enhancementPrompt = buildEnhancementPrompt({ 
      foodType, 
      visualStyle
    });
    const copyPrompt = buildCopywritingPrompt(foodType, visualStyle);
    const aspectRatio = formatSelected === "9:16" ? "9:16" : "1:1";

    const isBasicEnhancement = serviceId === 'resize_compression';

    let imageRes: any;
    let copyRes: any;

    if (isBasicEnhancement) {
      imageRes = await generateContentUnified("gemini-2.5-flash-image", enhancementPrompt, imageBase64, mimeType, aspectRatio);
    } else {
      [imageRes, copyRes] = await Promise.all([
        generateContentUnified("gemini-2.5-flash-image", enhancementPrompt, imageBase64, mimeType, aspectRatio),
        generateContentUnified("gemini-1.5-flash", copyPrompt, imageBase64, mimeType)
      ]);
    }

    // 4. Extract Results
    const finalImageBase64 = imageRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const finalMimeType = imageRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || "image/png";

    if (!finalImageBase64) {
      throw new Error("Falha ao gerar imagem.");
    }

    // Parse Copywriting if generated
    let copyTexts = [];
    if (!isBasicEnhancement && copyRes) {
      const copyTextRaw = copyRes.text() || "";
      let cleaned = copyTextRaw.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      try {
        copyTexts = JSON.parse(cleaned);
      } catch {
        console.warn("⚠️ Fallback copy due to parse error");
        copyTexts = [
          { id: "legenda", label: "Legenda", text: "Sabores irresistíveis esperando por você! ✨" }
        ];
      }
    }

    // 5. Usage Tracking (Fire and forget)
    const tokensInput = (imageRes.usageMetadata?.promptTokenCount || 0) + (copyRes?.usageMetadata?.promptTokenCount || 0);
    const tokensOutput = (imageRes.usageMetadata?.candidatesTokenCount || 0) + (copyRes?.usageMetadata?.candidatesTokenCount || 0);

    trackUsage({
      callType: "full_kit",
      model: "unified-kit-v1",
      userId: user.id,
      userEmail: user.email,
      tokensInput,
      tokensOutput,
      metadata: { foodType, visualStyle, serviceId }
    }).catch(console.error);

    // 5.1 Update Transaction with Tokens for Admin Oversight
    // Calculate cost in BRL
    const { data: rateData } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'usd_brl_rate')
      .single();
    
    const usdRate = parseFloat(String(rateData?.value || "5.50"));
    const INPUT_PRICE_USD_PER_M = 0.075;
    const OUTPUT_PRICE_USD_PER_M = 0.30;

    const costUsd = (tokensInput / 1000000 * INPUT_PRICE_USD_PER_M) + 
                    (tokensOutput / 1000000 * OUTPUT_PRICE_USD_PER_M);
    const costBrl = costUsd * usdRate;

    supabase.from('credit_transactions')
      .update({ 
        tokens_input: tokensInput, 
        tokens_output: tokensOutput,
        cost_brl: costBrl
      })
      .eq('reference_id', effectiveReferenceId)
      .then(({ error }) => {
        if (error) console.error("⚠️ Failed to update transaction tokens:", error);
      });

    // 6. Persist to History (Await this to get the URL)
    const savedCreation = await saveUserCreation({
      userId: user.id,
      imageBase64: finalImageBase64,
      mimeType: finalMimeType,
      foodType,
      visualStyle,
      formatSelected,
      copywritingTexts: copyTexts
    });

    // 7. Cleanup temp image (Optional but good practice)
    if (imagePath.startsWith('temp/')) {
      supabase.storage.from('creations').remove([imagePath]).catch(console.error);
    }

    // 8. Return Full Kit (No Base64 anymore!)
    return NextResponse.json({
      imageUrl: savedCreation.image_url,
      mimeType: finalMimeType,
      copyTexts: copyTexts,
      remaining_credits: creditResult.remaining_credits
    });

  } catch (error: any) {
    console.error("❌ Unified Kit API Error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno na geração do Kit." },
      { status: 500 }
    );
  }
}
