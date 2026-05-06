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
      className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-brand-dark relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10">
        {/* Error State */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full"
          >
            {(() => {
              const lowerError = error.toLowerCase();
              const isCreditError = 
                lowerError.includes("saldo") || 
                lowerError.includes("crédito") || 
                lowerError.includes("credito") ||
                lowerError.includes("insuficiente");
                
              return isCreditError ? (
                <div className="rounded-[40px] p-10 border border-white/5 shadow-2xl bg-brand-surface relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/5 blur-3xl pointer-events-none" />
                  
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-3xl bg-brand-gradient flex items-center justify-center text-white mx-auto mb-6 shadow-[0_20px_50px_rgba(234,29,44,0.3)] rotate-3">
                      <Sparkles size={40} className="animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">
                      Créditos <span className="text-transparent bg-clip-text bg-brand-gradient uppercase">Esgotados</span>
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto font-medium">
                      Suas fotos estão quase prontas para vender mais. Recarregue agora para concluir o processamento.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {[
                      { icon: Rocket, label: "Kit Start", sub: "10 créditos", price: "R$ 29,90", popular: false },
                      { icon: Star, label: "Combo Pro", sub: "30 créditos", price: "R$ 59,90", popular: true }
                    ].map((pkg, i) => (
                      <button 
                        key={i}
                        onClick={onGoToStore}
                        className={`group relative rounded-[32px] p-6 border transition-all duration-500 text-left flex flex-col gap-4 ${pkg.popular ? "bg-brand-dark/60 border-brand-orange/40 shadow-2xl" : "bg-brand-dark/30 border-white/5 hover:bg-brand-dark/50"}`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2.5 right-6 px-3 py-1 bg-brand-gradient text-white text-[8px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg">Mais Vendido</div>
                        )}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${pkg.popular ? "bg-brand-gradient text-white" : "bg-brand-surface text-white/20 group-hover:text-brand-orange"}`}>
                          <pkg.icon size={22} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-1 group-hover:text-brand-orange transition-colors">{pkg.label}</p>
                          <p className="text-lg font-black text-white tracking-tighter">{pkg.price}</p>
                          <p className="text-[10px] text-white/40 font-bold uppercase mt-1">{pkg.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={onBack}
                      className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white/5 text-white/30 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                    >
                      <ArrowLeft size={16} />
                      Cancelar
                    </button>
                    <button
                      onClick={onGoToStore}
                      className="flex-[1.5] flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-brand-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(234,29,44,0.3)] hover:shadow-[0_20px_50px_rgba(234,29,44,0.4)] hover:scale-[1.02] transition-all"
                    >
                      Turbinar meu Restaurante
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[48px] p-12 border border-white/5 shadow-2xl flex flex-col items-center text-center bg-brand-surface relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient opacity-20" />
                  <div className="w-24 h-24 rounded-full bg-brand-dark flex items-center justify-center text-brand-red mb-8 shadow-inner border border-white/5">
                    <RotateCcw size={48} className="animate-spin-slow opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Rocket size={32} className="rotate-[225deg]" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
                    Ops! Houve uma <span className="text-brand-red uppercase">falha</span>
                  </h3>
                  <p className="text-white/40 mb-12 max-w-sm leading-relaxed font-medium">
                    {error}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                      onClick={onBack}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white/5 text-white/30 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                    >
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    <button
                      onClick={onRetry}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-brand-gradient text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all"
                    >
                      <RotateCcw size={18} />
                      Recomeçar Agora
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Animated Loader */}
            <div className="relative w-40 h-40 mx-auto">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-brand-gradient rounded-full blur-2xl opacity-10 animate-pulse" />
              
              <div className="absolute inset-0 rounded-full border-4 border-white/5" />
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
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="160 300"
                  className="drop-shadow-[0_0_10px_rgba(234,29,44,0.5)]"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-3xl bg-brand-surface border border-white/10 flex items-center justify-center animate-float shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity" />
                  <Flame size={36} className="text-brand-orange relative z-10 drop-shadow-[0_0_15px_rgba(252,104,3,0.5)]" />
                </div>
              </div>
              
              {/* Circular floating particles */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-brand-orange rounded-full blur-[1px]" />
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-brand-red rounded-full blur-[1px]" />
              </motion.div>
            </div>

            {/* Status text */}
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-black text-white tracking-tighter font-display"
              >
                Criando sua <span className="text-transparent bg-clip-text bg-brand-gradient">Foto Premium...</span>
              </motion.h2>

              <div className="flex items-center justify-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                <span>{foodLabels[foodType] || foodType}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/40" />
                <span>Ambiente {styleLabels[style] || style}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="max-w-sm mx-auto">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Motor Neuronal</span>
                <span className="text-[10px] font-black text-brand-orange tracking-widest">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                <motion.div
                  className="h-full bg-brand-gradient relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 95)}%` }}
                  transition={{ duration: 0.5 }}
                >
                   <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-20 animate-shimmer" />
                </motion.div>
              </div>
            </div>

            {/* Rotating Tips */}
            <div className="bg-brand-surface rounded-[32px] p-8 min-h-[140px] flex items-center justify-center border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-gradient opacity-10" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-brand-orange shadow-inner">
                    {(() => {
                      const TipIcon = tips[currentTip].icon;
                      return <TipIcon size={20} />;
                    })()}
                  </div>
                  <div className="space-y-2">
                    <p className="text-white text-base leading-relaxed font-bold tracking-tight px-4">
                      "{tips[currentTip].text}"
                    </p>
                    <div className="flex items-center justify-center gap-2">
                       <div className="w-4 h-px bg-white/10" />
                       <span className="text-white/20 text-[9px] uppercase tracking-[0.2em] font-black">
                        {tips[currentTip].source}
                      </span>
                       <div className="w-4 h-px bg-white/10" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Back button */}
            <button
              onClick={onBack}
              className="group flex items-center gap-3 mx-auto text-white/20 hover:text-white/60 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 py-3 rounded-2xl hover:bg-white/5"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Cancelar Processamento
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
