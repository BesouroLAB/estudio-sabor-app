import { NextRequest, NextResponse } from "next/server";
import { generateContentUnified } from "@/lib/gemini";
import { FOOD_PRESETS } from "@/constants/photography";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imagePath, mimeType } = body;

    if (!imagePath || !mimeType) {
      return NextResponse.json(
        { error: "Missing required fields: imagePath, mimeType" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: imageBlob, error: downloadError } = await supabase.storage
      .from('creations')
      .download(imagePath);

    if (downloadError || !imageBlob) {
      console.error("❌ Classification Storage Error:", downloadError);
      return NextResponse.json({ error: "Falha ao recuperar imagem para classificação." }, { status: 500 });
    }

    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const imageBase64 = imageBuffer.toString('base64');

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

    const model = "gemini-1.5-flash";

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

    // Note: We DON'T delete the temp file here because it's still needed for the kit generation
    // unless this is a standalone classification call. In the main workflow, the kit API deletes it.

    return NextResponse.json({ foodId: validId });
  } catch (error: any) {
    console.error("❌ Classification failed:", error);
    return NextResponse.json({ error: error.message || "Classification failed" }, { status: 500 });
  }
}
