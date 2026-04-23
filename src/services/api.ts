export interface GenerateImageResult {
  base64Image: string;
  mimeType: string;
}

export interface CopyText {
  id: string;
  label: string;
  text: string;
}

export async function classifyImage(
  imageBase64: string,
  mimeType: string
): Promise<string> {
  const MOCK = process.env.NODE_ENV === "development";
  if (MOCK) {
    await new Promise(r => setTimeout(r, 1000));
    return "hamburger";
  }

  const response = await fetch("/api/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  if (!response.ok) return "brasileira"; // Fallback on error

  const data = await response.json();
  return data.foodId || "brasileira";
}

export async function generateImage(
  imageBase64: string,
  mimeType: string,
  foodType: string,
  visualStyle: string,
  formatSelected: string = "1:1"
): Promise<GenerateImageResult> {
  const MOCK = process.env.NODE_ENV === "development";
  if (MOCK) {
    // Fake delay
    await new Promise(r => setTimeout(r, 1500));
    return {
      base64Image: imageBase64,
      mimeType: mimeType,
    };
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType, foodType, visualStyle, formatSelected }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Generation failed with status ${response.status}`);
  }

  return response.json();
}

export async function generateCopywriting(
  foodType: string,
  visualStyle: string,
  imageBase64?: string,
  mimeType?: string
): Promise<CopyText[]> {
  const MOCK = process.env.NODE_ENV === "development";
  if (MOCK) {
    await new Promise(r => setTimeout(r, 1500));
    return [
      { id: "legenda-curta", label: "Legenda Curta", text: "Sabores irresistíveis! Experimente o melhor " + foodType + " da região hoje mesmo! 😋✨ #EstudioSabor #" + visualStyle },
      { id: "story", label: "Texto para Story", text: "NOVIDADE NA ÁREA 🔥 Clica aqui no link da bio e pede no iFood nosso novo especial!" },
      { id: "legenda-emocional", label: "Descritivo Emocional", text: "Cada garfada é uma viagem. Preparamos esse prato pensando em criar memórias inesquecíveis para você e quem você ama. Venha provar e sinta a diferença dos ingredientes selecionados à mão e do nosso tempero secreto." }
    ];
  }

  const response = await fetch("/api/copywriting", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ foodType, visualStyle, imageBase64, mimeType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Copywriting failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.texts;
}
