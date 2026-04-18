import type { CopyText } from "@/services/api";

export type AppStep = "upload" | "style" | "loading" | "result";

export interface UploadedImage {
  file: File;
  preview: string;
  base64: string;
}

export interface GenerationResult {
  base64Image: string;
  mimeType: string;
  copyTexts: CopyText[];
}
