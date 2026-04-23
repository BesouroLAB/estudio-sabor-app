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
    // 1. Check Circuit Breaker (Financial Safety)
    const safety = await checkCircuitBreaker();
    if (!safety.allowed) {
      console.warn("🛑 Circuit Breaker triggered:", safety.reason);
      return NextResponse.json(
        { 
          error: "Limite de uso diário atingido.", 
          reason: safety.reason,
          code: "BUDGET_EXCEEDED" 
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { imageBase64, mimeType, foodType, visualStyle, formatSelected = "1:1" } = body;

    if (!imageBase64 || !mimeType || !foodType || !visualStyle) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: imageBase64, mimeType, foodType, visualStyle",
        },
        { status: 400 }
      );
    }

    // Get authenticated user (if any)
    let userId: string | undefined;
    let userEmail: string | undefined;
    
    const supabase = await createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email ?? undefined;
      }
    } catch {
      // Not authenticated — proceed without user context
    }

    if (userId) {
      // Checagem do Kit Semanal (Créditos)
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();
        
      if (!profile || (profile.credits || 0) <= 0) {
        return NextResponse.json(
          { error: "Você não possui créditos suficientes. Recarregue na Loja para criar mais Kits Semanais." },
          { status: 403 }
        );
      }
    }

    const enhancementPrompt = buildEnhancementPrompt({ foodType, visualStyle });
    const aspectRatio = getAspectRatioForFood(foodType);
    const model = "gemini-2.5-flash-image";

    console.log(
      `🎨 Generating image: food=${foodType}, style=${visualStyle}, ratio=${aspectRatio}`
    );

    const result = await generateContentUnified(
      model,
      enhancementPrompt,
      imageBase64,
      mimeType,
      aspectRatio
    );

    const usageMetadata = result.usageMetadata;
    const tokensInput = usageMetadata?.promptTokenCount ?? 0;
    const tokensOutput = usageMetadata?.candidatesTokenCount ?? 0;

    const parts = result.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          console.log("✅ Image generated successfully");

          // Track usage (fire and forget) - including Base64 for storage upload
          trackUsage({
            callType: "image_generation",
            model,
            tokensInput,
            tokensOutput,
            isImageOutput: true,
            imageBase64: part.inlineData.data,
            userId,
            userEmail,
            metadata: { foodType, visualStyle, aspectRatio },
          });

          // Consumir 1 crédito do usuário pelo "Kit Semanal" entregue
          if (userId) {
             const { error: rpcError } = await supabase.rpc('decrement_credits', { user_id: userId });
             if (rpcError) {
                console.error("⚠️ Fallback para decremento manual de crédito", rpcError);
                const { data: p } = await supabase.from('profiles').select('credits').eq('id', userId).single();
                if (p) {
                   await supabase.from('profiles').update({ credits: Math.max(0, (p.credits || 0) - 1) }).eq('id', userId);
                }
             }

             // --- NOVO: PERSISTÊNCIA NO HISTÓRICO ---
             try {
                await saveUserCreation({
                   userId,
                   imageBase64: part.inlineData.data,
                   mimeType: part.inlineData.mimeType || "image/png",
                   foodType,
                   visualStyle,
                   formatSelected
                });
                console.log("💾 Creation saved to history successfully");
             } catch (saveError) {
                console.error("⚠️ Failed to save creation to history:", saveError);
                // We don't fail the whole request if saving to history fails, 
                // but ideally it shouldn't.
             }
          }

          return NextResponse.json({
            base64Image: part.inlineData.data,
            mimeType: part.inlineData.mimeType || "image/png",
          });
        }
      }
    }

    // Track failed generation
    trackUsage({
      callType: "image_generation",
      model,
      tokensInput,
      tokensOutput,
      isImageOutput: true,
      userId,
      userEmail,
      status: "error",
      errorMessage: "No image in response",
    });

    return NextResponse.json(
      { error: "No image was generated in the response" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("❌ Image generation failed:", error);

    const errorStr = JSON.stringify(error);
    if (
      errorStr.includes("REFERRER_BLOCKED") ||
      errorStr.includes("Referer")
    ) {
      return NextResponse.json(
        {
          error:
            "Erro de Permissão (API KEY): A chave do Gemini está restrita por Referrer. Como estamos no lado do servidor, você precisa remover a restrição de 'HTTP Referrer' no Google Cloud Console ou gerar uma nova chave para servidor.",
        },
        { status: 403 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Erro desconhecido na geração.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
