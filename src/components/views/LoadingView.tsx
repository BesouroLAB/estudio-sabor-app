"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChefHat, TrendingUp, Sparkles, ArrowLeft, RotateCcw, Rocket, Star } from "lucide-react";

interface LoadingViewProps {
  foodType: string;
  style: string;
  error?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
  onGoToStore?: () => void;
}

const tips = [
  {
    icon: TrendingUp,
    text: "Fotos profissionais no iFood aumentam as vendas em até 47%",
    source: "Pesquisa iFood 2024",
  },
  {
    icon: ChefHat,
    text: "Restaurantes com imagens de qualidade recebem 3x mais cliques",
    source: "Food Service News",
  },
  {
    icon: Sparkles,
    text: "Descrições criativas aumentam o ticket médio em 22%",
    source: "Estudo NRA",
  },
  {
    icon: Flame,
    text: "73% dos consumidores escolhem pelo visual antes de ler a descrição",
    source: "Consumer Behavior Report",
  },
];

const styleLabels: Record<string, string> = {
  rustico: "Rústico & Aconchegante",
  "premium-escuro": "Premium Escuro",
  clean: "Claro & Clean",
  gourmet: "Gourmet Chef",
};

const foodLabels: Record<string, string> = {
  pizza: "Pizza",
  hamburger: "Hambúrguer",
  sushi: "Sushi/Japonesa",
  sobremesa: "Sobremesa",
  salada: "Salada/Fit",
  cafe: "Café/Bebida",
  lanche: "Lanche/Wrap",
  "prato-feito": "Prato Feito",
};

export function LoadingView({ foodType, style, error, onRetry, onBack, onGoToStore }: LoadingViewProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);

  // Rotate tips
  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [error]);

  // Simulate progress (asymptotic to 95%)
  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const remaining = 95 - prev;
        return prev + remaining * 0.04;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center px-[var(--space-page)] py-12"
    >
      <div className="max-w-md w-full text-center">
        {/* Error State */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            {error.toLowerCase().includes("saldo") || error.toLowerCase().includes("crédito") ? (
              <div className="rounded-[32px] p-8 border border-[#EA1D2C]/30 shadow-[0_20px_50px_rgba(255,87,34,0.15)] bg-white/80">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EA1D2C] to-[#FC6803] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-red-500/20">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#3E3E3E] mb-2">
                    Seu saldo de créditos acabou
                  </h3>
                  <p className="text-[#717171] text-sm leading-relaxed max-w-md mx-auto">
                    Não pare agora! Escolha um pacote abaixo para continuar transformando suas fotos em vendas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={onGoToStore}
                    className="group relative rounded-2xl p-5 border border-[#EAEAEC] hover:border-[#FC6803] transition-all text-left flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Rocket size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#3E3E3E] group-hover:text-[#FC6803] transition-colors">Kit Emergência</p>
                      <p className="text-xs text-[#717171]">10 créditos • R$ 29,90</p>
                    </div>
                  </button>

                  <button 
                    onClick={onGoToStore}
                    className="group relative rounded-2xl p-5 border border-[#FC6803] bg-[#FC6803]/5 shadow-md text-left flex items-start gap-4"
                  >
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#FC6803] text-white text-[8px] font-bold rounded-full uppercase tracking-wider">Popular</div>
                    <div className="w-10 h-10 rounded-xl bg-[#FC6803]/10 flex items-center justify-center text-[#FC6803]">
                      <Star size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#3E3E3E]">Agência Digital</p>
                      <p className="text-xs text-[#717171]">30 créditos • R$ 59,90</p>
                    </div>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onBack}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-[#EAEAEC] text-[#717171] hover:text-[#3E3E3E] transition-all text-sm font-bold"
                  >
                    <ArrowLeft size={16} />
                    Voltar
                  </button>
                  <button
                    onClick={onGoToStore}
                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#EA1D2C] to-[#FC6803] text-white font-bold text-sm shadow-xl shadow-red-500/30 hover:scale-[1.02] transition-all active:scale-[0.98]"
                  >
                    Ver todos os pacotes
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-[32px] p-8 sm:p-12 border border-[#EAEAEC] shadow-2xl flex flex-col items-center text-center bg-white/80">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-[#EA1D2C] mb-6">
                  <RotateCcw size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#3E3E3E] mb-4">
                  Ops! Algo deu errado
                </h3>
                <p className="text-[#717171] mb-10 max-w-sm leading-relaxed">
                  {error}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={onBack}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-[#EAEAEC] text-[#717171] hover:text-[#3E3E3E] hover:bg-gray-50 transition-all text-sm font-bold"
                  >
                    <ArrowLeft size={16} />
                    Voltar
                  </button>
                  <button
                    onClick={onRetry}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-[#EA1D2C] hover:bg-[#D01925] text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
                  >
                    <RotateCcw size={16} />
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Animated Loader */}
            <div className="relative w-28 h-28 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full border-2 border-[#EAEAEC]" />
              <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EA1D2C" />
                    <stop offset="100%" stopColor="#FC6803" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="url(#loader-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="180 290"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center animate-float shadow-sm">
                  <Flame size={28} className="text-[#EA1D2C]" />
                </div>
              </div>
            </div>

            {/* Status text */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold text-xl text-[#3E3E3E] mb-2"
            >
              Processando inteligência artificial...
            </motion.h2>

            <p className="text-[#717171] text-sm mb-8">
              Aplicando <span className="text-[#EA1D2C] font-semibold">{styleLabels[style] || style}</span>{" "}
              {foodType !== "food" && <>para <span className="text-[#EA1D2C] font-semibold">{foodLabels[foodType] || foodType}</span></>}
            </p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#EAEAEC] rounded-full overflow-hidden mb-10">
              <motion.div
                className="h-full bg-[#EA1D2C] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 95)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Rotating Tips */}
            <div className="bg-[#F7F7F7] rounded-2xl p-6 min-h-[100px] flex items-center justify-center border border-[#EAEAEC]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-3"
                >
                  {(() => {
                    const TipIcon = tips[currentTip].icon;
                    return <TipIcon size={20} className="text-[#EA1D2C]" />;
                  })()}
                  <p className="text-[#3E3E3E] text-sm leading-relaxed font-medium">
                    <span className="italic">{tips[currentTip].text}</span>
                  </p>
                  <span className="text-[#717171] text-[10px] uppercase tracking-wider font-bold">
                    💡 {tips[currentTip].source}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="mt-6 flex items-center gap-1.5 mx-auto text-[#717171] hover:text-[#3E3E3E] text-xs font-medium transition-colors rounded-lg px-3 py-1.5"
            >
              <ArrowLeft size={14} />
              Cancelar e voltar
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
