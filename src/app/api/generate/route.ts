import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/gemini";
import { buildEnhancementPrompt, getAspectRatioForFood } from "@/lib/prompt-builder";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType, foodType, visualStyle } = body;

    if (!imageBase64 || !mimeType || !foodType || !visualStyle) {
      return NextResponse.json(
        { error: "Missing required fields: imageBase64, mimeType, foodType, visualStyle" },
        { status: 400 }
      );
    }

    const enhancementPrompt = buildEnhancementPrompt({ foodType, visualStyle });
    const aspectRatio = getAspectRatioForFood(foodType);

    console.log(`🎨 Generating image: food=${foodType}, style=${visualStyle}, ratio=${aspectRatio}`);

    const result = await withFallback(async (ai) => {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
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

    const parts = result.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          console.log("✅ Image generated successfully");
          return NextResponse.json({
            base64Image: part.inlineData.data,
            mimeType: part.inlineData.mimeType || "image/png",
          });
        }
      }
    }

    return NextResponse.json(
      { error: "No image was generated in the response" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("❌ Image generation failed:", error);
    
    const errorStr = JSON.stringify(error);
    if (errorStr.includes('REFERRER_BLOCKED') || errorStr.includes('Referer')) {
      return NextResponse.json({ 
        error: "Erro de Permissão (API KEY): A chave do Gemini está restrita por Referrer. Como estamos no lado do servidor, você precisa remover a restrição de 'HTTP Referrer' no Google Cloud Console ou gerar uma nova chave para servidor." 
      }, { status: 403 });
    }

    const message = error instanceof Error ? error.message : "Erro desconhecido na geração.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
