import type { CopyText } from "@/services/api";

export type AppStep = "hub" | "store" | "upload" | "style" | "loading" | "result" | "insufficient_credits";

export interface UploadedImage {
  file: File;
  preview: string;
  base64: string;
}

export interface GenerationResult {
  imageUrl: string;
  mimeType: string;
  copyTexts: CopyText[];
}
