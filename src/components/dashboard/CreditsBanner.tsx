"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CreditsBannerProps {
  credits: number;
  onCreatePhoto: () => void;
  onOpenStore?: () => void;
}

export function CreditsBanner({ credits, onCreatePhoto, onOpenStore }: CreditsBannerProps) {
  // Adaptive banner based on credit level
  if (credits >= 20) {
    return <FullCreditsBanner credits={credits} onCreatePhoto={onCreatePhoto} onOpenStore={onOpenStore} />;
  }

  if (credits > 0) {
    return <LowCreditsBanner credits={credits} onCreatePhoto={onCreatePhoto} onOpenStore={onOpenStore} />;
  }

  return <EmptyCreditsBanner onOpenStore={onOpenStore} />;
}

// State 1: Full credits (20+) — Celebratory, green accents
function FullCreditsBanner({ credits, onCreatePhoto, onOpenStore }: { credits: number; onCreatePhoto: () => void; onOpenStore?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 relative z-10">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Sparkles size={22} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3E3E3E]">
              🎉 Você tem <span className="text-emerald-600">{credits} créditos grátis</span> para testar!
            </h3>
            <p className="text-sm text-[#717171] mt-0.5">
              Transforme fotos simples em fotos profissionais para seu cardápio. Sem cartão de crédito.
            </p>
          </div>
        </div>

        <button
          onClick={onCreatePhoto}
          className="flex items-center gap-2 bg-[#EA1D2C] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#d1192a] active:scale-[0.98] transition-all shrink-0 shadow-sm"
        >
          <Zap size={16} />
          Criar Minha Primeira Foto
        </button>
      </div>

      {/* Decorative dots */}
      <div className="absolute top-2 right-2 w-24 h-24 opacity-10">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// State 2: Low credits (1-19) — Informative, amber accents
function LowCreditsBanner({ credits, onCreatePhoto, onOpenStore }: { credits: number; onCreatePhoto: () => void; onOpenStore?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 relative z-10">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Sparkles size={22} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3E3E3E]">
              Você ainda tem <span className="text-amber-600">{credits} crédito{credits !== 1 ? 's' : ''}</span>. Continue criando!
            </h3>
            <p className="text-sm text-[#717171] mt-0.5">
              Cada foto profissional custa 1 crédito. Aproveite seus créditos restantes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreatePhoto}
            className="flex items-center gap-2 bg-[#EA1D2C] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#d1192a] active:scale-[0.98] transition-all shrink-0"
          >
            Criar Foto
          </button>
          <button
            onClick={onOpenStore}
            className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors px-3 py-2.5"
          >
            Comprar mais <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// State 3: Empty credits — Urgency, red accents
function EmptyCreditsBanner({ onOpenStore }: { onOpenStore?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 relative z-10">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-[#EA1D2C]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3E3E3E]">
              Seus créditos acabaram
            </h3>
            <p className="text-sm text-[#717171] mt-0.5">
              Recarregue para continuar transformando suas fotos e vendendo mais no iFood.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenStore}
          className="flex items-center gap-2 bg-[#EA1D2C] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#d1192a] active:scale-[0.98] transition-all shrink-0 shadow-sm"
        >
          <ShoppingBagIcon size={16} />
          Comprar Créditos
        </button>
      </div>
    </motion.div>
  );
}

function ShoppingBagIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
