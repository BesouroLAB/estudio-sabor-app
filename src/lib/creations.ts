import { getAdminSupabase } from "./admin";
import { v4 as uuidv4 } from "uuid";

interface SaveCreationParams {
  userId: string;
  imageBase64: string;
  mimeType: string;
  foodType: string;
  visualStyle: string;
  formatSelected: string;
  copywritingTexts?: any[];
}

export async function saveUserCreation({
  userId,
  imageBase64,
  mimeType,
  foodType,
  visualStyle,
  formatSelected,
  copywritingTexts = []
}: SaveCreationParams) {
  const supabase = getAdminSupabase();
  const creationId = uuidv4();
  const fileName = `${userId}/${creationId}.${mimeType.split("/")[1] || "png"}`;

  // 1. Convert Base64 to Buffer for upload
  const buffer = Buffer.from(imageBase64, "base64");

  // 2. Upload to Storage (Bucket: creations)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("creations")
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: true
    });

  if (uploadError) {
    console.error("❌ Error uploading creation to storage:", uploadError);
    throw uploadError;
  }

  // 3. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from("creations")
    .getPublicUrl(fileName);

  // 4. Save to Database Table: creations
  const { data, error: dbError } = await supabase
    .from("creations")
    .insert({
      id: creationId,
      user_id: userId,
      image_url: publicUrl,
      format_selected: formatSelected,
      prompt_metadata: {
        food_type: foodType,
        visual_style: visualStyle,
      },
      copywriting_texts: copywritingTexts
    })
    .select()
    .single();

  if (dbError) {
    console.error("❌ Error saving creation to database:", dbError);
    throw dbError;
  }

  return data;
}
