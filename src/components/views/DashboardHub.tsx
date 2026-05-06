"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  Image as ImageIcon, 
  Flame, 
  Star, 
  LayoutTemplate, 
  Type, 
  Sparkles, 
  Camera,
  Maximize2,
  Clock,
  Download,
  TrendingUp,
  X,
  ArrowRight
} from "lucide-react";
import { CreditsBanner } from "@/components/dashboard/CreditsBanner";
import Link from "next/link";

interface DashboardHubProps {
  onStartKit: (serviceId: string) => void;
  onOpenStore: () => void;
  creditsRemaining: number;
  userName?: string;
  recentCreations?: any[];
  isVisitor?: boolean;
}

export function DashboardHub({ onStartKit, onOpenStore, creditsRemaining, userName, recentCreations = [], isVisitor = false }: DashboardHubProps) {
  const router = useRouter();
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
    
    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const greeting = () => {
    if (!mounted) return "Olá";
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const creationsCount = recentCreations?.length || 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto select-none bg-brand-dark text-white relative scrollbar-hide" suppressHydrationWarning>
      {/* Brand Aura Glows - Deep Immersive Lighting */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.01] blur-[200px] rounded-full pointer-events-none" />

      <div className="flex flex-col gap-10 p-6 lg:p-10 pb-32 md:pb-16 max-w-7xl mx-auto w-full relative z-10">

        {/* Welcome Header — High-End Typography */}
        {!isVisitor && (
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-gradient animate-pulse" />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Ambiente Profissional</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter font-display text-white">
                {userName && userName !== "Visitante (Mock)"
                  ? `${greeting()}, ${userName?.split(' ')[0]}.`
                  : `${greeting()}!`
                }
              </h1>
              <p className="text-sm text-slate-500 mt-2 font-bold uppercase tracking-wide">Seu estúdio de marketing de elite está pronto.</p>
            </div>
          </header>
        )}

        {/* Hero Banner — Immersive Experience for Visitors */}
        {isVisitor && (
          <section className="relative mt-0 mb-4 group">
            <div className="absolute -inset-1 bg-brand-gradient rounded-[48px] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="bg-brand-surface/50 backdrop-blur-xl border border-white/5 rounded-[48px] p-8 lg:p-16 overflow-hidden relative min-h-[400px] flex items-center shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-full h-full bg-grain opacity-5 pointer-events-none" />
              <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] animate-pulse" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-16 relative z-10">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-[2px] w-12 bg-brand-gradient" />
                    <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.5em]">IA Performance Food</span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-6xl font-black text-white mb-8 leading-[0.95] font-display tracking-tighter">
                    Venda mais com <br />
                    <span className="text-transparent bg-clip-text bg-brand-gradient">Fotos de Elite.</span>
                  </h1>
                  
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-[460px] font-medium tracking-tight">
                    A primeira inteligência artificial treinada para transformar fotos de celular em vitrines profissionais que convertem 3x mais pedidos.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/estudio/ferramentas/aprimorar-prato')}
                      className="w-full sm:w-auto bg-brand-gradient text-white px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_60px_rgba(255,0,46,0.4)] hover:shadow-[0_30px_80px_rgba(255,0,46,0.5)] transition-all flex items-center justify-center gap-3 group"
                    >
                      <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
                      Começar Grátis
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center relative">
                  <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
                    {/* Floating ambient elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-red/10 blur-[100px] rounded-full" />
                    
                    {/* Before Card */}
                    <motion.div 
                      initial={{ rotate: -12, x: -60, opacity: 0 }}
                      animate={{ rotate: -12, x: -60, opacity: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute w-[260px] aspect-[3/4] bg-brand-dark p-2.5 rounded-[32px] shadow-2xl z-20 border border-white/5 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
                    >
                      <img 
                        src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761958152/combo_AMERICAN-BURGUER_original_ls5ybn.jpg" 
                        className="w-full h-full object-cover rounded-[24px]" 
                        alt="Antes" 
                      />
                      <div className="absolute -bottom-4 -left-4 bg-brand-dark/90 backdrop-blur-xl text-white/50 text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border border-white/10 shadow-xl">
                        FOTO ORIGINAL
                      </div>
                    </motion.div>

                    {/* After Card (Premium IA) */}
                    <motion.div 
                      initial={{ rotate: 8, x: 60, opacity: 0 }}
                      animate={{ rotate: 8, x: 60, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="absolute w-[300px] aspect-[3/4] bg-brand-surface p-2.5 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-30 border border-white/10"
                    >
                      <div className="absolute -inset-0.5 bg-brand-gradient rounded-[40px] blur-md opacity-30 animate-pulse"></div>
                      <img 
                        src="https://res.cloudinary.com/do8gdtozt/image/upload/v1769465007/download_19_kftypg.png" 
                        className="relative w-full h-full object-cover rounded-[32px]" 
                        alt="Depois IA" 
                      />
                      <div className="absolute -top-6 -right-6 bg-brand-gradient text-white text-[11px] font-black px-6 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <Sparkles size={16} className="animate-spin-slow" /> RESULTADO IA
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Premium Tools Section — Elite Card Design */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[20px] bg-brand-gradient flex items-center justify-center shadow-[0_10px_30px_rgba(255,0,46,0.3)]">
                <Flame size={24} className="text-white animate-bounce-subtle" />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-brand-orange uppercase tracking-[0.4em] mb-1">Elite Marketing</h3>
                <h2 className="text-2xl font-black text-white tracking-tighter">Ferramentas de Criação</h2>
              </div>
            </div>
            <Link 
              href="/estudio/loja-de-creditos" 
              className="group flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              <Sparkles size={14} className="text-brand-orange group-hover:rotate-12 transition-transform" />
              Recarregar Créditos
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <PremiumToolCard 
              icon={<ImageIcon size={32} />}
              title="Aprimorar Prato"
              desc="Transforme qualquer foto amadora em estúdio profissional de alta gastronomia."
              credits={1}
              onClick={() => router.push('/estudio/ferramentas/aprimorar-prato')}
              accent="red"
            />
            <PremiumToolCard 
              icon={<LayoutTemplate size={32} />}
              title="Post para Feed"
              desc="Design profissional + Legenda magnética otimizada para o algoritmo do Instagram."
              credits={2}
              onClick={() => router.push('/estudio/ferramentas/gerador-post-feed-instagram')}
              accent="orange"
            />
            <PremiumToolCard 
              icon={<TrendingUp size={32} />}
              title="Stories de Venda"
              desc="Scripts e visuais otimizados para converter seguidores em pedidos reais."
              credits={2}
              onClick={() => router.push('/estudio/ferramentas/gerador-stories-instagram')}
              accent="yellow"
            />
            <PremiumToolCard 
              icon={<Star size={32} />}
              title="Kit Dominação"
              desc="Tudo o que você precisa para uma campanha de elite completa em segundos."
              credits={5}
              onClick={() => router.push('/estudio/ferramentas/gerador-kit-marketing-ifood')}
              accent="red"
              featured
            />
          </div>
        </section>

        {/* Recursos de Apoio — Sleek Compact Cards */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
            <div>
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Suporte Estratégico</h3>
              <h2 className="text-xl font-black text-white tracking-tighter">Recursos Gratuitos</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FreeToolCard 
              icon={<Type size={24} />}
              title="Copiadora iFood"
              desc="Crie descrições que dão água na boca instantaneamente."
              onClick={() => router.push('/estudio/ferramentas/gerador-descricao-ifood')}
            />
            <FreeToolCard 
              icon={<Camera size={24} />}
              title="Guia de Ângulos"
              desc="Aprenda o segredo dos 45º usados pelas grandes redes."
              onClick={() => router.push('/estudio/ferramentas/foto-ifood-angulo-45-graus')}
            />
            <FreeToolCard 
              icon={<Maximize2 size={24} />}
              title="Ajuste de Mídia"
              desc="Garanta que sua capa e destaques fiquem no tamanho perfeito."
              onClick={() => router.push('/estudio/ferramentas/tamanho-capa-ifood')}
            />
          </div>
        </section>

        {/* Recent Creations — Immersive Gallery */}
        {recentCreations.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(255,138,0,0.3)]" />
                <div>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Histórico</h3>
                  <h2 className="text-xl font-black text-white tracking-tighter">Suas Últimas Criações</h2>
                </div>
              </div>
              <Link href="/estudio/minhas-criacoes" className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-2 group">
                Ver Galeria <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-6">
              {recentCreations.slice(0, 6).map((creation, index) => (
                <motion.div
                  key={creation.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  onClick={() => setZoomedImage({ url: creation.image_url, label: creation.food_type, isAfter: true })}
                  className="group relative aspect-[3/4] rounded-[32px] overflow-hidden bg-brand-surface border border-white/10 shadow-2xl cursor-pointer"
                >
                  <img
                    src={creation.image_url}
                    alt={creation.food_type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                    <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.2em] mb-1">IA GENERATIVE</p>
                    <p className="text-[11px] text-white font-black uppercase tracking-widest truncate">{creation.food_type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal Zoom — Premium Immersive Backdrop */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/95 backdrop-blur-2xl transition-all"
          >
            <div className="relative max-w-5xl w-full flex flex-col items-center">
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setZoomedImage(null)}
                className="absolute -top-20 right-0 w-14 h-14 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 active:scale-90"
              >
                <X size={28} />
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-brand-gradient rounded-[48px] blur-3xl opacity-20 pointer-events-none"></div>
                <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                  <img src={zoomedImage.url} alt={zoomedImage.label} className="max-h-[75vh] w-auto object-contain" />
                </div>
                
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-brand-surface border border-white/10 px-8 py-4 rounded-full flex items-center gap-6 shadow-2xl backdrop-blur-xl">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">PROJETO</span>
                      <span className="text-sm font-black text-white uppercase tracking-widest">{zoomedImage.label}</span>
                   </div>
                   <div className="w-px h-8 bg-white/10" />
                   <button className="flex items-center gap-2 text-[11px] font-black text-brand-orange uppercase tracking-widest hover:text-white transition-colors">
                      <Download size={16} /> BAIXAR
                   </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FreeToolCard({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.03)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-brand-surface/40 backdrop-blur-sm border border-white/5 p-8 rounded-[32px] flex items-center gap-6 text-left transition-all hover:border-emerald-500/40 group overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 shadow-inner">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-black text-white mb-1.5 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">{title}</p>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{desc}</p>
      </div>
      <ArrowRight size={18} className="text-white/10 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
    </motion.button>
  );
}

function PremiumToolCard({ icon, title, desc, credits, onClick, accent, featured = false }: { icon: React.ReactNode; title: string; desc: string; credits: number; onClick: () => void; accent: 'red' | 'orange' | 'yellow'; featured?: boolean }) {
  const accentColors = {
    red: "text-brand-red bg-brand-red/10 border-brand-red/20",
    orange: "text-brand-orange bg-brand-orange/10 border-brand-orange/20",
    yellow: "text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20"
  };

  return (
    <motion.button
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-8 rounded-[40px] text-left transition-all border group overflow-hidden flex flex-col h-full bg-brand-surface/60 backdrop-blur-sm ${
        featured ? "border-brand-red/30 shadow-[0_30px_60px_rgba(255,0,46,0.15)]" : "border-white/5 shadow-2xl"
      } hover:border-brand-red/50 hover:bg-brand-surface/80`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-grain opacity-[0.03] pointer-events-none" />
      
      {/* Background Accent Gradient */}
      <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-all ${
        accent === 'red' ? 'bg-brand-red' : accent === 'orange' ? 'bg-brand-orange' : 'bg-brand-yellow'
      }`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-2xl ${accentColors[accent]} border`}>
            {icon}
          </div>
          <div className="flex items-center gap-2 bg-brand-dark/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <Zap size={14} className={`fill-current ${accent === 'red' ? 'text-brand-red' : 'text-brand-orange'}`} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{credits} {credits === 1 ? 'crédito' : 'créditos'}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <h4 className="text-2xl font-black text-white mb-3 leading-[1.1] tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-brand-gradient transition-all">{title}</h4>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{desc}</p>
        </div>

        {/* Action Indicator */}
        <div className="mt-8 flex items-center gap-3 text-[11px] font-black text-brand-orange uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          Acessar Agora <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </div>

      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[9px] font-black px-4 py-1 rounded-b-xl uppercase tracking-widest shadow-xl">
          MAIS POPULAR
        </div>
      )}
    </motion.button>

  );
}
