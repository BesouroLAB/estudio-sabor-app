"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { useDashboard } from "@/context/DashboardContext";
import {
  Flame,
  RotateCcw,
  LogOut,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { DashboardHub } from "@/components/views/DashboardHub";
import { StoreView } from "@/components/views/StoreView";
import { UploadView } from "@/components/views/UploadView";
import { StyleSelectorView } from "@/components/views/StyleSelectorView";
import { LoadingView } from "@/components/views/LoadingView";
import { ResultDashboard } from "@/components/views/ResultDashboard";
import { generateImage, generateCopywriting } from "@/services/api";
import type { AppStep, UploadedImage, GenerationResult } from "@/types/app";

const stepLabels: Record<AppStep, string> = {
  hub: "Início",
  store: "Loja",
  upload: "Enviar Foto",
  style: "Escolher Estilo",
  loading: "Gerando...",
  result: "Seu Pacote",
};

export default function DashboardClient({ 
  user,
  initialCredits,
  userName,
  initialStep = "hub"
}: { 
  user: User;
  initialCredits: number;
  userName?: string;
  initialStep?: AppStep;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<AppStep>(initialStep);
  const { setTitle, setShowProgress, setCurrentIndex, setStepsCount } = useDashboard();

  const steps: AppStep[] = ["hub", "upload", "style", "loading", "result"];
  const currentIndex = steps.indexOf(step);

  // Sincronizar Header Universal
  useEffect(() => {
    const isWizard = step !== "hub";
    setTitle(stepLabels[step]);
    setShowProgress(isWizard);
    if (isWizard) {
      setCurrentIndex(currentIndex);
      setStepsCount(steps.length);
    }
  }, [step, currentIndex, setTitle, setShowProgress, setCurrentIndex, setStepsCount]);

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );
  
  // Deep-linking states
  const [selectedFood, setSelectedFood] = useState<string | null>(
    searchParams.get("foodType")
  );
  const [selectedStyle, setSelectedStyle] = useState<string | null>(
    searchParams.get("visualStyle")
  );
  const [selectedFormat, setSelectedFormat] = useState<string>("1:1");
  
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const handleImageUpload = useCallback((image: UploadedImage) => {
    setUploadedImage(image);
    setStep("style");
  }, []);

  const handleStyleConfirm = useCallback(
    async (food: string, style: string, format: string) => {
      if (!uploadedImage) return;

      setSelectedFood(food);
      setSelectedStyle(style);
      setSelectedFormat(format);
      setStep("loading");
      setLoadingError(null);
      setGenerationResult(null);
      abortRef.current = false;

      try {
        const [imageResult, copyTexts] = await Promise.all([
          generateImage(
            uploadedImage.base64,
            uploadedImage.file.type,
            food,
            style,
            format
          ),
          generateCopywriting(
            food,
            style,
            uploadedImage.base64,
            uploadedImage.file.type
          ),
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
    setStep("hub");
    setUploadedImage(null);
    setSelectedFood(null);
    setSelectedStyle(null);
    setGenerationResult(null);
    setLoadingError(null);
  }, []);

  const handleBack = useCallback(() => {
    if (step === "upload" || step === "store") {
      setStep("hub");
    } else if (step === "style") {
      setStep("upload");
    } else if (step === "loading") {
      abortRef.current = true;
      setLoadingError(null);
      setStep("style");
    }
  }, [step]);

  return (
    <>
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "hub" && (
            <DashboardHub 
              key="hub" 
              creditsRemaining={initialCredits} 
              userName={userName}
              onStartKit={() => setStep("upload")}
              onOpenStore={() => setStep("store")}
            />
          )}
          {step === "store" && (
            <StoreView 
              key="store" 
              userId={user.id}
              onBack={handleBack}
            />
          )}
          {step === "upload" && (
            <UploadView key="upload" onImageUpload={handleImageUpload} onBack={handleBack} />
          )}
          {step === "style" && (
            <StyleSelectorView
              key="style"
              uploadedImage={uploadedImage!}
              initialFood={selectedFood || undefined}
              initialStyle={selectedStyle || undefined}
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
