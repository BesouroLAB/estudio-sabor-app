"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChefHat, TrendingUp, Sparkles, AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

interface LoadingViewProps {
  foodType: string;
  style: string;
  error?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
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

export function LoadingView({ foodType, style, error, onRetry, onBack }: LoadingViewProps) {
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
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-red-400" />
            </div>

            <h2 className="font-display font-bold text-xl text-text-primary mb-2">
              Algo deu errado
            </h2>
            <p className="text-text-muted text-sm mb-6 leading-relaxed max-w-sm">
              {error}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-subtle text-text-muted hover:text-text-primary hover:border-white/15 transition-all text-sm font-medium focus-ring"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-bold text-sm shadow-lg shadow-pepper-red/25 hover:shadow-pepper-red/40 transition-all active:scale-[0.98] focus-ring"
              >
                <RotateCcw size={16} />
                Tentar novamente
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Animated Loader */}
            <div className="relative w-28 h-28 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DC2626" />
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pepper-red/20 to-pepper-orange/10 flex items-center justify-center animate-float">
                  <Flame size={28} className="text-pepper-orange" />
                </div>
              </div>
            </div>

            {/* Status text */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display font-bold text-xl text-text-primary mb-2"
            >
              Criando seu pacote de marketing...
            </motion.h2>

            <p className="text-text-muted text-sm mb-8">
              Estilizando com <span className="text-pepper-orange font-semibold">{styleLabels[style] || style}</span>{" "}
              para <span className="text-pepper-red font-semibold">{foodLabels[foodType] || foodType}</span>
            </p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-10">
              <motion.div
                className="h-full bg-gradient-to-r from-pepper-red to-pepper-orange rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 95)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Rotating Tips */}
            <div className="glass rounded-2xl p-6 min-h-[100px] flex items-center justify-center">
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
                    return <TipIcon size={20} className="text-pepper-orange" />;
                  })()}
                  <p className="text-text-secondary text-sm leading-relaxed">
                    💡 <span className="italic">{tips[currentTip].text}</span>
                  </p>
                  <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">
                    {tips[currentTip].source}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="mt-6 flex items-center gap-1.5 mx-auto text-text-muted hover:text-text-primary text-xs font-medium transition-colors focus-ring rounded-lg px-3 py-1.5"
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
