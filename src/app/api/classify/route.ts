import { NextRequest, NextResponse } from "next/server";
import { generateContentUnified } from "@/lib/gemini";
import { FOOD_PRESETS } from "@/constants/photography";
import { trackUsage } from "@/lib/usage-tracker";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Missing required fields: imageBase64, mimeType" },
        { status: 400 }
      );
    }

    const foodOptions = FOOD_PRESETS.map(p => `${p.id}: ${p.name} (${p.description})`).join("\n");

    const prompt = `
      Você é um especialista em visão computacional e gastronomia.
      Analise a imagem fornecida e classifique-a em UMA das seguintes categorias de comida:
      
      ${foodOptions}
      
      Retorne APENAS o ID da categoria (ex: "hamburger" ou "pizza").
      Se estiver em dúvida, escolha a categoria "brasileira" como padrão.
      Se for uma bebida, use "drink".
      
      RETORNO ESPERADO: apenas o ID em letras minúsculas.
    `;

    const model = "gemini-1.5-flash"; // Using 1.5 Flash for speed and reliability in classification

    const response = await generateContentUnified(
      model,
      prompt,
      imageBase64,
      mimeType
    );

    const foodId = response.text().trim().toLowerCase();
    
    // Validate that the returned ID exists
    const validId = FOOD_PRESETS.some(p => p.id === foodId) ? foodId : "brasileira";

    console.log(`🔍 AI Classified image as: ${validId}`);

    return NextResponse.json({ foodId: validId });
  } catch (error: any) {
    console.error("❌ Classification failed:", error);
    return NextResponse.json({ error: error.message || "Classification failed" }, { status: 500 });
  }
}
