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
      className="flex-1 flex flex-col items-center justify-center p-[var(--space-page)] bg-[#0A0A0A] text-white relative overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EA1D2C]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF5C00]/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-[#EA1D2C]/40 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#EA1D2C] to-[#FF5C00] flex items-center justify-center text-white shadow-2xl shadow-[#EA1D2C]/30">
            <Sparkles size={40} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
          Sua criatividade não tem limites, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA1D2C] to-[#FF5C00]">
            mas seus créditos acabaram.
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Para continuar gerando fotos de capa premium e kits de marketing que vendem mais, 
          você precisa de saldo em sua conta.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Kit Essencial */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#EA1D2C]/50 transition-all backdrop-blur-sm group relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center mb-6 group-hover:bg-[#EA1D2C] transition-all">
              <Rocket size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 text-left">Kit Essencial</h3>
            <p className="text-2xl font-black text-white mb-4 text-left">R$ 29,90</p>
            <ul className="space-y-3 mb-8 text-left">
              <li className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C]" />
                10 Créditos Iniciais
              </li>
              <li className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C]" />
                R$ 2,99 por foto
              </li>
            </ul>
            <button 
              onClick={onGoToStore}
              className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white hover:text-black transition-all"
            >
              Selecionar
            </button>
          </motion.div>

          {/* Combo Cardápio */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-8 rounded-[32px] bg-[#111111] border-2 border-[#EA1D2C] relative shadow-2xl group overflow-hidden"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#EA1D2C] to-[#FF5C00] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg z-20">
              Mais Popular
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EA1D2C]/10 blur-2xl rounded-full" />
            
            <div className="w-12 h-12 rounded-2xl bg-[#EA1D2C] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#EA1D2C]/20">
              <Star size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 text-left">Combo Cardápio</h3>
            <p className="text-2xl font-black text-white mb-4 text-left">R$ 59,90</p>
            <ul className="space-y-3 mb-8 text-left">
              <li className="text-xs text-slate-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                30 Créditos Premium
              </li>
              <li className="text-xs text-slate-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                R$ 1,99 por foto
              </li>
            </ul>
            <button 
              onClick={onGoToStore}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#EA1D2C] to-[#FF5C00] text-white font-bold text-sm shadow-xl shadow-[#EA1D2C]/20 hover:brightness-110 transition-all"
            >
              Selecionar
            </button>
          </motion.div>

          {/* Kit Dominação */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#EA1D2C]/50 transition-all backdrop-blur-sm group relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center mb-6 group-hover:bg-[#EA1D2C] transition-all">
              <Diamond size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 text-left">Kit Dominação</h3>
            <p className="text-2xl font-black text-white mb-4 text-left">R$ 149,90</p>
            <ul className="space-y-3 mb-8 text-left">
              <li className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C]" />
                100 Créditos Ilimitados
              </li>
              <li className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C]" />
                R$ 1,49 por foto
              </li>
            </ul>
            <button 
              onClick={onGoToStore}
              className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white hover:text-black transition-all"
            >
              Selecionar
            </button>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 text-slate-400 hover:text-white font-bold text-sm transition-all"
          >
            <ArrowLeft size={18} />
            Voltar ao Dashboard
          </button>
          
          <div className="h-px w-12 bg-white/10 hidden sm:block" />

          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag size={14} className="text-[#EA1D2C]" />
            Pagamento Seguro via Mercado Pago
          </p>
        </div>
      </div>
    </motion.div>
  );
}
