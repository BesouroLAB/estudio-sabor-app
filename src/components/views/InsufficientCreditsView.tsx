"use client";

import { motion } from "framer-motion";
import { Sparkles, Rocket, Star, Diamond, ArrowLeft, ShoppingBag } from "lucide-react";

interface InsufficientCreditsViewProps {
  onBack: () => void;
  onGoToStore: () => void;
}

export function InsufficientCreditsView({ onBack, onGoToStore }: InsufficientCreditsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col items-center justify-center p-[var(--space-page)] bg-white"
    >
      <div className="max-w-3xl w-full text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#EA1D2C] to-[#FC6803] flex items-center justify-center text-white shadow-2xl shadow-red-500/30">
            <Sparkles size={48} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4 tracking-tight">
          Sua criatividade não tem limites, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA1D2C] to-[#FC6803]">mas seus créditos acabaram.</span>
        </h1>
        
        <p className="text-[#717171] text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Para continuar gerando fotos de capa premium e kits completos de marketing, 
          você precisa de saldo em sua conta.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Kit Emergência */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-6 rounded-[32px] bg-white border border-[#EAEAEC] hover:border-[#EA1D2C]/30 transition-all shadow-sm hover:shadow-xl group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Rocket size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#3E3E3E] mb-1 text-left">Kit Emergência</h3>
            <p className="text-2xl font-bold text-[#1A1A1A] mb-4 text-left">R$ 29,90</p>
            <ul className="space-y-2 mb-6 text-left">
              <li className="text-xs text-[#717171] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                10 Créditos Iniciais
              </li>
              <li className="text-xs text-[#717171] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Válido por tempo ilimitado
              </li>
            </ul>
            <button 
              onClick={onGoToStore}
              className="w-full py-3 rounded-2xl bg-[#F7F7F7] text-[#3E3E3E] font-bold text-sm hover:bg-[#EA1D2C] hover:text-white transition-all"
            >
              Selecionar
            </button>
          </motion.div>

          {/* Agência Digital */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-6 rounded-[32px] bg-white border-2 border-[#EA1D2C] relative shadow-2xl group"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#EA1D2C] to-[#FC6803] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
              Melhor Custo
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EA1D2C] flex items-center justify-center mb-6 group-hover:bg-[#EA1D2C] group-hover:text-white transition-all">
              <Star size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#3E3E3E] mb-1 text-left">Agência Digital</h3>
            <p className="text-2xl font-bold text-[#1A1A1A] mb-4 text-left">R$ 59,90</p>
            <ul className="space-y-2 mb-6 text-left">
              <li className="text-xs text-[#717171] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                30 Créditos Premium
              </li>
              <li className="text-xs text-[#717171] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Suporte Prioritário
              </li>
            </ul>
            <button 
              onClick={onGoToStore}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#EA1D2C] to-[#FC6803] text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:brightness-110 transition-all"
            >
              Selecionar
            </button>
          </motion.div>

          {/* Kit Império */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-6 rounded-[32px] bg-white border border-[#EAEAEC] hover:border-[#EA1D2C]/30 transition-all shadow-sm hover:shadow-xl group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Diamond size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#3E3E3E] mb-1 text-left">Kit Império Pro</h3>
            <p className="text-2xl font-bold text-[#1A1A1A] mb-4 text-left">R$ 149,90</p>
            <ul className="space-y-2 mb-6 text-left">
              <li className="text-xs text-[#717171] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                100 Créditos Ilimitados
              </li>
              <li className="text-xs text-[#717171] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Acesso Early Bird
              </li>
            </ul>
            <button 
              onClick={onGoToStore}
              className="w-full py-3 rounded-2xl bg-[#F7F7F7] text-[#3E3E3E] font-bold text-sm hover:bg-[#EA1D2C] hover:text-white transition-all"
            >
              Selecionar
            </button>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 text-[#717171] hover:text-[#1A1A1A] font-bold text-sm transition-all"
          >
            <ArrowLeft size={18} />
            Voltar ao Dashboard
          </button>
          
          <div className="h-px w-12 bg-[#EAEAEC] hidden sm:block" />

          <p className="text-[10px] text-[#A6A6A6] font-bold uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag size={14} />
            Pagamento Seguro via Mercado Pago
          </p>
        </div>
      </div>
    </motion.div>
  );
}
