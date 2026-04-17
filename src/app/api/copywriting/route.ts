import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/gemini";
import { buildCopywritingPrompt } from "@/lib/prompt-builder";

export const maxDuration = 30;

interface CopyText {
  id: string;
  label: string;
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { foodType, visualStyle, imageBase64, mimeType } = body;

    if (!foodType || !visualStyle) {
      return NextResponse.json(
        { error: "Missing required fields: foodType, visualStyle" },
        { status: 400 }
      );
    }

    const prompt = buildCopywritingPrompt(foodType, visualStyle);

    console.log(`✍️ Generating copywriting: food=${foodType}, style=${visualStyle}`);

    const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [];

    // If image is provided, include it for context
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    parts.push({ text: prompt });

    const result = await withFallback(async (ai) => {
      return await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: {
          parts: parts,
        },
      });
    });

    const responseText = result.text || "";
    console.log("📝 Raw copywriting response:", responseText.substring(0, 200));

    // Parse JSON from response (handle markdown code blocks)
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    let copyTexts: CopyText[];
    try {
      copyTexts = JSON.parse(cleaned);
    } catch {
      console.warn("⚠️ Failed to parse AI response as JSON, using fallback texts");
      copyTexts = [
        {
          id: "persuasivo",
          label: "Persuasivo",
          text: "🔥 Já imaginou aquele aroma inconfundível chegando quentinho na sua porta? Peça agora e deixe seu jantar inesquecível!",
        },
        {
          id: "descritivo",
          label: "Descritivo",
          text: "Prato preparado artesanalmente com ingredientes frescos do dia. Embalagem térmica que mantém a temperatura ideal.",
        },
        {
          id: "urgencia",
          label: "Urgência",
          text: "⚡ PROMOÇÃO RELÂMPAGO — Só hoje! Últimas unidades do dia. Corre que é por tempo limitado! 🏃‍♂️",
        },
      ];
    }

    console.log("✅ Copywriting generated successfully");
    return NextResponse.json({ texts: copyTexts });
  } catch (error: any) {
    console.error("❌ Copywriting generation failed:", error);
    
    const errorStr = JSON.stringify(error);
    if (errorStr.includes('REFERRER_BLOCKED') || errorStr.includes('Referer')) {
      return NextResponse.json({ 
        error: "Erro de Permissão (API KEY): A chave do Gemini está restrita por Referrer. Remova a restrição no Google Cloud Console para uso server-side." 
      }, { status: 403 });
    }

    const message = error instanceof Error ? error.message : "Erro desconhecido na geração.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
