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
import { generateImage, generateCopywriting, classifyImage } from "@/services/api";
import { createClient } from "@/lib/supabase/client";
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

  // Sincronizar Header Universal
  // Inicializar créditos e sincronizar Header Universal
  useEffect(() => {
    setUserCredits(initialCredits);
  }, [initialCredits, setUserCredits]);

  useEffect(() => {
    const isWizard = step !== "hub";
    setTitle(stepLabels[step]);
    setShowProgress(isWizard);
    if (isWizard) {
      setCurrentIndex(currentIndex);
      setStepsCount(steps.length);
    }
  }, [step, currentIndex, setTitle, setShowProgress, setCurrentIndex, setStepsCount]);

  // Capturar retorno do Mercado Pago
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      alert("🎉 Pagamento Aprovado! Seus créditos já estão disponíveis na sua conta.");
      // Limpa os params para não mostrar o alert toda vez que renderizar
      router.replace("/dashboard", { scroll: false });
    } else if (paymentStatus === "pending") {
      alert("⏳ Pagamento em Processamento! Assim que o Mercado Pago confirmar, seus créditos serão liberados automaticamente.");
      router.replace("/dashboard", { scroll: false });
    } else if (paymentStatus === "failure") {
      alert("⚠️ Ocorreu um erro no pagamento. Por favor, tente novamente.");
      router.replace("/dashboard", { scroll: false });
      setStep("store"); // Volta para a loja em caso de falha
    }
  }, [searchParams, router]);

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
  const [isClassifying, setIsClassifying] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("ifood_kit");
  const [selectedOptions, setSelectedOptions] = useState<{ keepAngle: boolean; keepBackground: boolean }>({ keepAngle: false, keepBackground: false });
  const [isFastPath, setIsFastPath] = useState(false);
  const abortRef = useRef(false);

  const startWorkflow = useCallback((serviceId: string) => {
    if (userCredits < 1 && user.id !== 'mock-temporario') {
      setStep("store");
      return;
    }
    setSelectedService(serviceId);
    setIsFastPath(serviceId === "ifood_kit");
    setStep("upload");
  }, [userCredits, user.id]);

  const handleImageUpload = useCallback(async (image: UploadedImage) => {
    setUploadedImage(image);
    setStep("style");
    setIsClassifying(true);
    
    try {
      const detectedFood = await classifyImage(image.base64, image.file.type);
      setSelectedFood(detectedFood);
      
      // Se for o caminho rápido do iFood, pular a seleção de estilo e ir direto para o loading
      if (isFastPath) {
        handleStyleConfirm(detectedFood, "ifood", "1:1", { keepAngle: false, keepBackground: false });
      }
    } catch (error) {
      console.error("Classification failed:", error);
    } finally {
      setIsClassifying(false);
    }
  }, []);

  const handleStyleConfirm = useCallback(
    async (food: string, style: string, format: string, options: { keepAngle: boolean; keepBackground: boolean }) => {
      if (!uploadedImage) return;

      // Definir custo base conforme o serviço selecionado
      // Mapeamento de custos: ifood_kit = 8, full_kit_promo = 25
      const serviceType = selectedService === 'ifood_kit' ? 'ia_food_preset' : 'full_kit_promo';
      
      setSelectedFood(food);
      setSelectedStyle(style);
      setSelectedFormat(format);
      setSelectedOptions(options);
      setStep("loading");
      setLoadingError(null);
      setGenerationResult(null);
      abortRef.current = false;

      try {
        // 1. Consumir créditos via RPC (Atômico)
        const referenceId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const { data: rpcResponse, error: rpcError } = await supabase.rpc('consume_credits', {
          p_user_id: user.id,
          p_service_id: serviceType,
          p_reference_id: referenceId
        });

        // Debug log se necessário: console.log('RPC Response:', rpcResponse, rpcError);

        if (rpcError) {
          throw new Error("Erro técnico ao validar créditos.");
        }

        // A função RPC retorna um JSONB com { success: boolean, error?: string, remaining_credits?: number }
        const result = rpcResponse as { success: boolean; error?: string; remaining_credits?: number };

        if (!result.success) {
          throw new Error(result.error === "Créditos insuficientes" 
            ? "Saldo insuficiente. Visite nossa Loja para garantir mais créditos e turbinar seu cardápio!" 
            : result.error || "Erro ao validar créditos.");
        }

        // Atualizar saldo local com o valor retornado
        if (result.remaining_credits !== undefined) {
          setUserCredits(result.remaining_credits);
        }

        // 2. Gerar conteúdo
        const [imageResult, copyTexts] = await Promise.all([
          generateImage(
            uploadedImage.base64,
            uploadedImage.file.type,
            food,
            style,
            format,
            options
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

        // 3. Persistência Silenciosa em "Minhas Criações"
        if (user.id !== 'mock-temporario') {
          try {
            const fileName = `${user.id}/${Date.now()}.png`;
            const blob = await (await fetch(`data:${imageResult.mimeType};base64,${imageResult.base64Image}`)).blob();
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('creations')
              .upload(fileName, blob, { 
                contentType: imageResult.mimeType,
                upsert: true
              });

            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage.from('creations').getPublicUrl(fileName);
              
              await supabase.from('creations').insert({
                user_id: user.id,
                image_url: publicUrl,
                format_selected: format,
                prompt_metadata: { food: food, style: style, options },
                copywriting_texts: copyTexts
              });
            } else {
              console.warn("Erro ao fazer upload da criação:", uploadError);
            }
          } catch (saveErr) {
            console.error("Erro ao salvar no histórico:", saveErr);
          }
        }

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
    [uploadedImage, supabase, setUserCredits, selectedService]
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
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "hub" && (
            <DashboardHub 
              key="hub" 
              creditsRemaining={userCredits} 
              userName={userName}
              onStartKit={() => startWorkflow("ifood_kit")}
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
              key="result"
              uploadedImage={uploadedImage!}
              generationResult={generationResult}
              foodType={selectedFood!}
              style={selectedStyle!}
              format={selectedFormat!}
              onNewPackage={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
