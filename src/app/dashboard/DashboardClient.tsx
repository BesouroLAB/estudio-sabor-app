"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import {
  Flame,
  RotateCcw,
  LogOut,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { UploadView } from "@/components/views/UploadView";
import { StyleSelectorView } from "@/components/views/StyleSelectorView";
import { LoadingView } from "@/components/views/LoadingView";
import { ResultDashboard } from "@/components/views/ResultDashboard";
import { generateImage, generateCopywriting } from "@/services/api";
import type { AppStep, UploadedImage, GenerationResult } from "@/types/app";

const stepLabels: Record<AppStep, string> = {
  upload: "Enviar Foto",
  style: "Escolher Estilo",
  loading: "Gerando...",
  result: "Seu Pacote",
};

export default function DashboardClient({ user }: { user: User }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<AppStep>("upload");
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
  
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);
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
        const [imageResult, copyTexts] = await Promise.all([
          generateImage(
            uploadedImage.base64,
            uploadedImage.file.type,
            food,
            style
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

  const steps: AppStep[] = ["upload", "style", "loading", "result"];
  const currentIndex = steps.indexOf(step);

  return (
    <>
      {/* Header with user info */}
      <header className="sticky top-0 z-50 glass border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-[var(--space-page)] h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 group focus-ring rounded-lg"
            aria-label="Voltar ao início"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pepper-red to-pepper-orange flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Flame size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-text-primary hidden sm:block">
              Estúdio & Sabor
            </span>
          </button>

          {/* Step Indicator */}
          <div className="flex items-center gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <motion.div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= currentIndex
                      ? "bg-gradient-to-r from-pepper-red to-pepper-orange w-6 sm:w-8"
                      : "bg-white/10 w-4 sm:w-6"
                  }`}
                  layout
                />
                <span
                  className={`text-[10px] font-medium tracking-wider uppercase hidden md:block transition-colors ${
                    i === currentIndex
                      ? "text-pepper-orange"
                      : i < currentIndex
                        ? "text-text-secondary"
                        : "text-text-muted"
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>
            ))}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            {/* Credits badge */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-pepper-orange/10 border border-pepper-orange/20">
              <Sparkles size={12} className="text-pepper-orange" />
              <span className="text-pepper-orange text-xs font-semibold">
                1 grátis
              </span>
            </div>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center">
                <UserIcon size={14} className="text-text-muted" />
              </div>
              <span className="text-text-secondary text-xs hidden sm:block max-w-24 truncate">
                {user.email}
              </span>
            </div>

            {/* Logout */}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-7 h-7 rounded-lg bg-bg-elevated border border-border-default flex items-center justify-center text-text-muted hover:text-pepper-red hover:border-pepper-red/30 transition-all"
                title="Sair"
              >
                <LogOut size={14} />
              </button>
            </form>

            {/* Reset */}
            {step !== "upload" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleReset}
                className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-xs font-medium transition-colors focus-ring rounded-lg px-2 py-1"
                aria-label="Recomeçar"
              >
                <RotateCcw size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <UploadView key="upload" onImageUpload={handleImageUpload} />
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
