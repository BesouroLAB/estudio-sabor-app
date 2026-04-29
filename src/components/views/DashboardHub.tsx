"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ImageIcon, Type, ArrowRight, LayoutTemplate, TrendingUp, Download, Clock, Star, Zap, Flame } from "lucide-react";
import { CreditsBanner } from "@/components/dashboard/CreditsBanner";

import { useState, useEffect, useCallback } from "react";
import { X, Maximize2 } from "lucide-react";

interface DashboardHubProps {
  onStartKit: () => void;
  onOpenStore: () => void;
  creditsRemaining: number;
  userName?: string;
  recentCreations?: any[];
}

export function DashboardHub({ onStartKit, onOpenStore, creditsRemaining, userName, recentCreations = [] }: DashboardHubProps) {
  const [mounted, setMounted] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; label: string; isAfter: boolean } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    if (!mounted) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    if (diffInDays === 1) return "Ontem";
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const greeting = () => {
    if (!mounted) return "Olá";
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Logic to avoid "loose data"
  const creationsCount = recentCreations?.length || 0;
  const professionalismScore = Math.min(30 + (creationsCount * 8), 98);
  const totalDownloads = Math.floor(creationsCount * 1.5);
  const reachEstimate = (creationsCount * 1250).toLocaleString('pt-BR');

  return (
    <div className="flex flex-col h-full overflow-y-auto select-none bg-[#F7F7F7]">
      <div className="flex flex-col gap-6 p-6 lg:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full">

        {/* Welcome Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              {userName && userName !== "Visitante (Mock)"
                ? `${greeting()}, ${userName?.split(' ')[0]}.`
                : `${greeting()}! 👋`
              }
            </h1>
            <p className="text-sm text-[#717171] mt-0.5">O que vamos criar para seu cardápio hoje?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EAEAEC] shadow-sm">
              <Zap size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-[#3E3E3E]">{creditsRemaining} créditos</span>
            </div>
            <button
              onClick={onOpenStore}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA1D2C] text-white text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-red-100"
            >
              <Sparkles size={14} />
              Recarregar
            </button>
          </div>
        </header>

        {/* Credits Banner — Adaptive */}
        <CreditsBanner credits={creditsRemaining} onCreatePhoto={onStartKit} onOpenStore={onOpenStore} />

        {/* KPI Row — Value Anchoring */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            icon={<Star size={16} />}
            label="Score de Perfil"
            value={`${professionalismScore}%`}
            accent="amber"
            description="Qualidade do Cardápio"
          />
          <KPICard
            icon={<ImageIcon size={16} />}
            label="Fotos Criadas"
            value={String(creationsCount)}
            accent="gray"
            description="Ativos de Venda"
          />
          <KPICard
            icon={<TrendingUp size={16} />}
            label="Economia"
            value={`R$ ${(creationsCount * 150).toLocaleString('pt-BR')}`}
            accent="emerald"
            description="vs. Fotógrafo"
          />
          <KPICard
            icon={<Clock size={16} />}
            label="Tempo Salvo"
            value={`${creationsCount * 2}h`}
            accent="blue"
            description="Automação IA"
          />
        </section>

      {/* Hero Area — High Impact Design */}
      <section className="relative">
        <div className="bg-[#EA1D2C] rounded-[40px] p-8 lg:p-14 overflow-hidden relative min-h-[460px] flex items-center shadow-2xl shadow-red-500/10">
          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-black/10 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-12 relative z-10">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-8 bg-white/40" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.3em]">IA Performance Food</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-[1.05] tracking-tight font-jakarta">
                Fotos que <span className="text-yellow-300">dominam</span> o iFood.
              </h2>
              
              <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-[450px]">
                Nossa IA transforma qualquer clique em uma vitrine profissional que aumenta sua taxa de cliques em até 3x.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={onStartKit}
                  className="w-full sm:w-auto bg-white text-[#EA1D2C] px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Star size={18} className="fill-[#EA1D2C]" />
                  KIT IFOOD COMPLETO
                </button>
                <button
                  onClick={onStartKit}
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                >
                  PERSONALIZAR FOTO
                </button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              {/* Dynamic Interactive Cards — Fan Effect */}
              <div className="relative w-full max-w-[540px] aspect-[4/3] flex items-center justify-center group/showcase">
                {/* Back Card (Before) */}
                <motion.div 
                  initial={{ rotate: -8, x: -50, opacity: 0 }}
                  animate={{ rotate: -8, x: -50, opacity: 1 }}
                  onClick={() => setZoomedImage({ 
                    url: "https://res.cloudinary.com/do8gdtozt/image/upload/v1761958152/combo_AMERICAN-BURGUER_original_ls5ybn.jpg", 
                    label: "Foto Original",
                    isAfter: false 
                  })}
                  whileHover={{ 
                    rotate: -2, 
                    x: -80, 
                    zIndex: 40,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="absolute w-[320px] aspect-[3/4] bg-white p-2.5 rounded-[28px] shadow-2xl z-20 border border-white/20 cursor-pointer transition-shadow hover:shadow-red-500/10 group/card"
                >
                  <img 
                    src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761958152/combo_AMERICAN-BURGUER_original_ls5ybn.jpg" 
                    className="w-full h-full object-cover rounded-[20px] grayscale-[0.2] brightness-90 group-hover/card:brightness-100 transition-all" 
                    alt="Antes" 
                  />
                  <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-wider">
                    Foto Original
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                </motion.div>

                {/* Front Card (After) */}
                <motion.div 
                  initial={{ rotate: 6, x: 50, opacity: 0 }}
                  animate={{ rotate: 6, x: 50, opacity: 1 }}
                  onClick={() => setZoomedImage({ 
                    url: "https://res.cloudinary.com/do8gdtozt/image/upload/v1769465007/download_19_kftypg.png", 
                    label: "Resultado IA",
                    isAfter: true 
                  })}
                  whileHover={{ 
                    rotate: 2, 
                    x: 80, 
                    zIndex: 40,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="absolute w-[320px] aspect-[3/4] bg-white p-2.5 rounded-[28px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] z-30 border border-white/20 cursor-pointer transition-shadow hover:shadow-red-500/20 group/card"
                >
                  <img 
                    src="https://res.cloudinary.com/do8gdtozt/image/upload/v1769465007/download_19_kftypg.png" 
                    className="w-full h-full object-cover rounded-[20px] group-hover/card:scale-[1.02] transition-transform" 
                    alt="Depois" 
                  />
                  <div className="absolute top-5 right-5 bg-[#EA1D2C] text-white text-[9px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles size={11} /> Resultado IA
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-[#EA1D2C]/40 backdrop-blur-md p-4 rounded-full text-white">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                  
                  {/* Subtle Shimmer Effect on After Card */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_4s_infinite] pointer-events-none rounded-[28px]" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Sub-Cards — Subtle and Useful */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SubActionCard 
            icon={<ImageIcon size={20} />}
            title="Remoção de Fundo"
            desc="Limpeza perfeita com IA"
            onClick={onStartKit}
          />
          <SubActionCard 
            icon={<Sparkles size={20} />}
            title="Geração de Cenários"
            desc="Fotos 100% profissionais"
            onClick={onStartKit}
          />
          <SubActionCard 
            icon={<Type size={20} />}
            title="Copywriting Automático"
            desc="Textos que vendem"
            onClick={onStartKit}
          />
        </div>
      </section>

        {/* Recent Creations — Visual Refresh */}
        {recentCreations.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-[#A6A6A6] uppercase tracking-[0.2em] font-jakarta">
                Criações Recentes
              </h3>
              <Link href="/dashboard/history" className="text-xs font-bold text-[#EA1D2C] hover:underline">
                Ver todas
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentCreations.slice(0, 4).map((creation, index) => (
                <motion.div
                  key={creation.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-square rounded-[24px] overflow-hidden bg-white border border-[#EAEAEC] shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <img
                    src={creation.image_url}
                    alt={creation.food_type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-sm font-jakarta">{creation.food_type}</p>
                        <p className="text-white/60 text-[10px] flex items-center gap-1">
                          <Clock size={10} /> {formatTimeAgo(creation.created_at)}
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#EA1D2C] transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Zoom Modal — Cosmic Premium */}
      {zoomedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12"
        >
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setZoomedImage(null)}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 max-w-5xl w-full h-full flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="relative pointer-events-auto group">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.label}
                className="max-h-[85vh] w-auto rounded-[32px] shadow-2xl border border-white/10"
              />
              
              {/* Modal UI */}
              <div className="absolute top-6 left-6">
                <div className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${zoomedImage.isAfter ? 'bg-[#EA1D2C] text-white' : 'bg-white/20 backdrop-blur-md text-white'}`}>
                  {zoomedImage.isAfter && <Sparkles size={14} />}
                  {zoomedImage.label}
                </div>
              </div>

              <button
                onClick={() => setZoomedImage(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#EA1D2C] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="mt-6 text-white/40 text-xs font-bold uppercase tracking-[0.4em] pointer-events-auto cursor-pointer hover:text-white transition-colors" onClick={() => setZoomedImage(null)}>
              Clique fora para fechar
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function SubActionCard({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, shadow: "0 10px 20px -5px rgba(0,0,0,0.05)" }}
      onClick={onClick}
      className="bg-white border border-[#EAEAEC] p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-[#EA1D2C]/30 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] text-[#717171] flex items-center justify-center transition-colors group-hover:bg-[#EA1D2C]/10 group-hover:text-[#EA1D2C]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-[#3E3E3E] mb-0.5">{title}</p>
        <p className="text-[11px] font-medium text-[#717171]">{desc}</p>
      </div>
    </motion.div>
  );
}

function KPICard({ icon, label, value, accent, description }: { icon: React.ReactNode; label: string; value: string; accent: "red" | "gray" | "emerald" | "blue" | "amber" | "green"; description?: string }) {
  const accentColors: Record<string, string> = {
    red: "text-[#EA1D2C]",
    gray: "text-[#717171]",
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    amber: "text-amber-500",
    green: "text-emerald-500",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-[#EAEAEC] p-4 rounded-2xl shadow-sm flex flex-col gap-2 transition-all duration-300"
    >
      <div className="flex items-center gap-2">
        <div className={`${accentColors[accent]} opacity-80`}>
          {icon}
        </div>
        <span className="text-[9px] font-bold text-[#A6A6A6] uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-[#1A1A1A] leading-none">{value}</span>
        {description && <span className="text-[10px] text-[#A6A6A6] font-medium mt-1">{description}</span>}
      </div>
    </motion.div>
  );
}
