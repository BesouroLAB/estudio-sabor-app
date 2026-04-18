import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/gemini";
import {
  buildEnhancementPrompt,
  getAspectRatioForFood,
} from "@/lib/prompt-builder";
import { trackUsage, checkCircuitBreaker } from "@/lib/usage-tracker";
import { createClient } from "@/lib/supabase/server";

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
    const { imageBase64, mimeType, foodType, visualStyle } = body;

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
    try {
      const supabase = await createClient();
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

    const enhancementPrompt = buildEnhancementPrompt({ foodType, visualStyle });
    const aspectRatio = getAspectRatioForFood(foodType);
    const model = "gemini-2.5-flash-image";

    console.log(
      `🎨 Generating image: food=${foodType}, style=${visualStyle}, ratio=${aspectRatio}`
    );

    const result = await withFallback(async (ai) => {
      return await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            { text: enhancementPrompt },
          ],
        },
        config: {
          responseModalities: ["image", "text"],
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      });
    });

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
