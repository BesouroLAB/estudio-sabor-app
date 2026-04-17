export interface GenerateImageResult {
  base64Image: string;
  mimeType: string;
}

export interface CopyText {
  id: string;
  label: string;
  text: string;
}

export async function generateImage(
  imageBase64: string,
  mimeType: string,
  foodType: string,
  visualStyle: string
): Promise<GenerateImageResult> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType, foodType, visualStyle }),
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
