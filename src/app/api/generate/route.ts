import { NextRequest, NextResponse } from "next/server";
import { generateContentUnified } from "@/lib/gemini";
import {
  buildEnhancementPrompt,
  getAspectRatioForFood,
} from "@/lib/prompt-builder";
import { trackUsage, checkCircuitBreaker } from "@/lib/usage-tracker";
import { createClient } from "@/lib/supabase/server";
import { saveUserCreation } from "@/lib/creations";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const safety = await checkCircuitBreaker();
    if (!safety.allowed) {
      return NextResponse.json(
        { error: "Limite de uso diário atingido.", reason: safety.reason, code: "BUDGET_EXCEEDED" },
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
      keepAngle = false,
      keepBackground = false
    } = body;

    if (!imagePath || !mimeType || !foodType || !visualStyle) {
      return NextResponse.json(
        { error: "Missing required fields: imagePath, mimeType, foodType, visualStyle" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
        
      if (!profile || (profile.credits || 0) <= 0) {
        return NextResponse.json(
          { error: "Você não possui créditos suficientes." },
          { status: 403 }
        );
      }
    }

    // Download from storage
    const { data: imageBlob, error: downloadError } = await supabase.storage
      .from('creations')
      .download(imagePath);

    if (downloadError || !imageBlob) {
      console.error("❌ Image Storage Error:", downloadError);
      return NextResponse.json({ error: "Falha ao recuperar imagem original." }, { status: 500 });
    }

    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const imageBase64 = imageBuffer.toString('base64');

    const enhancementPrompt = buildEnhancementPrompt({ foodType, visualStyle });
    const aspectRatio = getAspectRatioForFood(foodType);
    const model = "gemini-2.5-flash-image";

    const result = await generateContentUnified(
      model,
      enhancementPrompt,
      imageBase64,
      mimeType,
      aspectRatio
    );

    const usageMetadata = result.usageMetadata;
    const parts = result.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          const finalImageBase64 = part.inlineData.data;

          trackUsage({
            callType: "image_generation",
            model,
            tokensInput: usageMetadata?.promptTokenCount ?? 0,
            tokensOutput: usageMetadata?.candidatesTokenCount ?? 0,
            isImageOutput: true,
            imageBase64: finalImageBase64,
            userId: user?.id,
            userEmail: user?.email,
            metadata: { foodType, visualStyle, aspectRatio },
          });

          if (user) {
            const { error: decError } = await supabase.rpc('decrement_credits', { user_id: user.id });
            if (decError) console.error("❌ Failed to decrement credits:", decError.message);
            
            await saveUserCreation({
              userId: user.id,
              imageBase64: finalImageBase64,
              mimeType: part.inlineData.mimeType || "image/png",
              foodType,
              visualStyle,
              formatSelected
            }).catch(console.error);
          }

          // Cleanup temp image
          if (imagePath.startsWith('temp/')) {
            supabase.storage.from('creations').remove([imagePath]).catch(console.error);
          }

          return NextResponse.json({
            base64Image: finalImageBase64,
            mimeType: part.inlineData.mimeType || "image/png",
          });
        }
      }
    }

    return NextResponse.json({ error: "Geração falhou: sem imagem no retorno" }, { status: 500 });
  } catch (error: any) {
    console.error("❌ Image generation failed:", error);
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}
