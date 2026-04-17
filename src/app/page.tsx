"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { UploadView } from "@/components/views/UploadView";
import { StyleSelectorView } from "@/components/views/StyleSelectorView";
import { LoadingView } from "@/components/views/LoadingView";
import { ResultDashboard } from "@/components/views/ResultDashboard";
import { generateImage, generateCopywriting } from "@/services/api";
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

export default function Home() {
  const [step, setStep] = useState<AppStep>("upload");
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const handleImageUpload = useCallback((image: UploadedImage) => {
    setUploadedImage(image);
    setStep("style");
  }, []);

  const handleStyleConfirm = useCallback(
    async (food: string, style: string) => {
      if (!uploadedImage) return;

      setSelectedFood(food);
      setSelectedStyle(style);
      setStep("loading");
      setLoadingError(null);
      setGenerationResult(null);
      abortRef.current = false;

      try {
        // Run image generation and copywriting in parallel
        const [imageResult, copyTexts] = await Promise.all([
          generateImage(uploadedImage.base64, uploadedImage.file.type, food, style),
          generateCopywriting(food, style, uploadedImage.base64, uploadedImage.file.type),
        ]);

        if (abortRef.current) return;

        setGenerationResult({
          base64Image: imageResult.base64Image,
          mimeType: imageResult.mimeType,
          copyTexts: copyTexts,
        });
        setStep("result");
      } catch (error) {
        if (abortRef.current) return;
        console.error("Generation failed:", error);
        setLoadingError(
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado. Tente novamente."
        );
      }
    },
    [uploadedImage]
  );

  const handleRetry = useCallback(() => {
    if (selectedFood && selectedStyle) {
      handleStyleConfirm(selectedFood, selectedStyle);
    }
  }, [selectedFood, selectedStyle, handleStyleConfirm]);

  const handleReset = useCallback(() => {
    abortRef.current = true;
    setStep("upload");
    setUploadedImage(null);
    setSelectedFood(null);
    setSelectedStyle(null);
    setGenerationResult(null);
    setLoadingError(null);
  }, []);

  const handleBack = useCallback(() => {
    if (step === "style") {
      setStep("upload");
    } else if (step === "loading") {
      abortRef.current = true;
      setLoadingError(null);
      setStep("style");
    }
  }, [step]);

  return (
    <>
      <Header onReset={handleReset} currentStep={step} />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <UploadView key="upload" onImageUpload={handleImageUpload} />
          )}

          {step === "style" && (
            <StyleSelectorView
              key="style"
              uploadedImage={uploadedImage!}
              onConfirm={handleStyleConfirm}
              onBack={handleBack}
            />
          )}

          {step === "loading" && (
            <LoadingView
              key="loading"
              foodType={selectedFood!}
              style={selectedStyle!}
              error={loadingError}
              onRetry={handleRetry}
              onBack={handleBack}
            />
          )}

          {step === "result" && generationResult && (
            <ResultDashboard
              key="result"
              uploadedImage={uploadedImage!}
              generationResult={generationResult}
              foodType={selectedFood!}
              style={selectedStyle!}
              onNewPackage={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
