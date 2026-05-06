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
import { InsufficientCreditsView } from "@/components/views/InsufficientCreditsView";
import { generateImage, generateCopywriting, classifyImage, generateFullKit, uploadImage } from "@/services/api";
import { createClient } from "@/lib/supabase/client";
import type { AppStep, UploadedImage, GenerationResult } from "@/types/app";

const stepLabels: Record<AppStep, string> = {
  hub: "Início",
  store: "Loja",
  upload: "Enviar Foto",
  style: "Escolher Estilo",
  loading: "Gerando...",
  result: "Seu Pacote",
  insufficient_credits: "Recarga Necessária",
};

export default function DashboardClient({
  user,
  initialCredits,
  userName,
  initialStep = "hub",
  recentCreations = []
}: {
  user: User;
  initialCredits: number;
  userName?: string;
  initialStep?: AppStep;
  recentCreations?: any[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<AppStep>(initialStep);
  const {
    setTitle,
    setShowProgress,
    setCurrentIndex,
    setStepsCount,
    userCredits,
    setUserCredits
  } = useDashboard();

  const supabase = createClient();

  const steps: AppStep[] = ["hub", "upload", "style", "loading", "result"];
  const currentIndex = steps.indexOf(step);

  useEffect(() => {
    const isWizard = step !== "hub";
    setTitle(stepLabels[step]);
    setShowProgress(isWizard);
    if (isWizard) {
      setCurrentIndex(currentIndex);
      setStepsCount(steps.length);
    }
  }, [step, currentIndex, setTitle, setShowProgress, setCurrentIndex, setStepsCount]);

  // Sync server-fetched credits into context (page.tsx has the authoritative value)
  useEffect(() => {
    if (initialCredits > 0 || userCredits === 0) {
      setUserCredits(initialCredits);
    }
  }, [initialCredits]);

  // Capturar retorno do Mercado Pago
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      alert("🎉 Pagamento Aprovado! Seus créditos já estão disponíveis na sua conta.");
      // Limpa os params para não mostrar o alert toda vez que renderizar
      router.replace("/estudio", { scroll: false });
    } else if (paymentStatus === "pending") {
      alert("⏳ Pagamento em Processamento! Assim que o Mercado Pago confirmar, seus créditos serão liberados automaticamente.");
      router.replace("/estudio", { scroll: false });
    } else if (paymentStatus === "failure") {
      alert("⚠️ Ocorreu um erro no pagamento. Por favor, tente novamente.");
      router.replace("/estudio", { scroll: false });
      setStep("store"); // Volta para a loja em caso de falha
    }
  }, [searchParams, router]);

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );
  const [imagePath, setImagePath] = useState<string | null>(null);

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
  const [isClassifying, setIsClassifying] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("ifood_kit");
  const [selectedOptions, setSelectedOptions] = useState<{ keepAngle: boolean; keepBackground: boolean }>({ keepAngle: false, keepBackground: false });
  const [isFastPath, setIsFastPath] = useState(false);
  const abortRef = useRef(false);

  const startWorkflow = useCallback((serviceId: string) => {
    // Determine required credits based on serviceId
    const isFreeTool = ['ifood_cropper', 'copy_generator', 'photo_guide'].includes(serviceId);
    const requiredCredits = isFreeTool ? 0 : serviceId === 'kit_completo' ? 5 : serviceId === 'post_rede_social' ? 2 : serviceId === 'stories_rede_social' ? 2 : 1;
    if (userCredits < requiredCredits && user.id !== 'mock-temporario') {
      setStep("insufficient_credits");
      return;
    }
    setSelectedService(serviceId);
    // For now, all options go through the fast path to skip style selection and simplify the UX
    setIsFastPath(true);
    setStep("upload");
  }, [userCredits, user.id]);

  const handleImageUpload = useCallback(async (image: UploadedImage) => {
    setUploadedImage(image);
    setStep("style");
    setIsClassifying(true);

    try {
      // 1. Otimização: Upload imediato para Storage para remover Base64 do payload das APIs
      const path = await uploadImage(image.file);
      setImagePath(path);

      // 2. Classificação usando o path
      const detectedFood = await classifyImage(path, image.file.type);
      setSelectedFood(detectedFood);

      // Se for o caminho rápido, pular a seleção de estilo e ir direto para o loading
      if (isFastPath) {
        let format = "1:1";
        if (selectedService === 'instagram_stories') format = "9:16";
        handleStyleConfirm(detectedFood, "ifood", format, { keepAngle: false, keepBackground: false }, path);
      }
    } catch (error: any) {
      console.error("Upload/Classification failed:", error);
      setLoadingError(error.message || "Erro ao subir ou processar a imagem.");
      setStep("loading"); // Ir para tela de carregamento que já sabe exibir erros
    } finally {
      setIsClassifying(false);
    }
  }, [isFastPath]); // handleStyleConfirm dependency added conceptually

  const handleStyleConfirm = useCallback(
    async (food: string, style: string, format: string, options: { keepAngle: boolean; keepBackground: boolean }, overridePath?: string) => {
      const currentPath = overridePath || imagePath;
      if (!uploadedImage || !currentPath) return;

      setSelectedFood(food);
      setSelectedStyle(style);
      setSelectedFormat(format);
      setSelectedOptions(options);
      setStep("loading");
      setLoadingError(null);
      setGenerationResult(null);
      abortRef.current = false;

      try {
        const referenceId = `kit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const serviceType = selectedService; // Use the exact serviceId from the Hub

        // 1. Geração Unificada e Segura usando imagePath
        const kitResult = await generateFullKit(
          currentPath,
          uploadedImage.file.type,
          food,
          style,
          format,
          serviceType,
          referenceId,
          options
        );

        if (abortRef.current) return;

        // 2. Atualizar saldo no contexto global (Header)
        if (kitResult.remaining_credits !== undefined) {
          setUserCredits(kitResult.remaining_credits);
        }

        setGenerationResult({
          imageUrl: kitResult.imageUrl,
          mimeType: kitResult.mimeType,
          copyTexts: kitResult.copyTexts,
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
    [uploadedImage, imagePath, supabase, setUserCredits, selectedService]
  );

  const handleRetry = useCallback(() => {
    if (selectedFood && selectedStyle) {
      handleStyleConfirm(selectedFood, selectedStyle, selectedFormat, selectedOptions);
    }
  }, [selectedFood, selectedStyle, selectedFormat, selectedOptions, handleStyleConfirm]);

  const handleReset = useCallback(() => {
    abortRef.current = true;
    setStep("hub");
    setUploadedImage(null);
    setSelectedFood(null);
    setSelectedStyle(null);
    setGenerationResult(null);
    setLoadingError(null);
    setIsFastPath(false);
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
      <main className="flex-1 flex flex-col" suppressHydrationWarning>
        <AnimatePresence mode="wait">
          {step === "hub" && (
            <DashboardHub
              key="hub"
              creditsRemaining={userCredits}
              userName={userName}
              isVisitor={user.id === "mock-temporario"}
              onStartKit={(serviceId) => startWorkflow(serviceId)}
              onOpenStore={() => setStep("store")}
              recentCreations={recentCreations}
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
              isDetecting={isClassifying}
              onConfirm={handleStyleConfirm}
              onBack={() => setStep("upload")}
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
              onGoToStore={() => setStep("store")}
            />
          )}
          {step === "result" && generationResult && (
            <ResultDashboard
              user={user}
              key="result"
              uploadedImage={uploadedImage!}
              generationResult={generationResult}
              foodType={selectedFood!}
              style={selectedStyle!}
              format={selectedFormat!}
              onNewPackage={handleReset}
            />
          )}
          {step === "insufficient_credits" && (
            <InsufficientCreditsView
              key="insufficient"
              onBack={() => setStep("hub")}
              onGoToStore={() => setStep("store")}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
