"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    <div className="flex flex-col h-full overflow-y-auto select-none bg-[#FAFAFA]" suppressHydrationWarning>
      <div className="flex flex-col gap-6 p-6 lg:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full">

        {/* Welcome Header — Apenas para usuários logados, compacto */}
        {!isVisitor && (
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                {userName && userName !== "Visitante (Mock)"
                  ? `${greeting()}, ${userName?.split(' ')[0]}.`
                  : `${greeting()}!`
                }
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Seu estúdio de marketing para delivery com IA.</p>
            </div>
          </header>
        )}



        {/* Hero Banner — Visitantes veem primeiro, logados veem abaixo */}
        {isVisitor && (
          <section className="relative mt-0 mb-4">
            <div className="bg-[#EA1D2C] rounded-[32px] p-6 lg:p-8 overflow-hidden relative min-h-[260px] flex items-center shadow-xl shadow-red-500/10">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-black/10 rounded-full blur-3xl" />

              <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 relative z-10">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px w-8 bg-white/40" />
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.3em]">IA Performance Food</span>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight font-display tracking-tight">
                    A Melhor IA para o seu <span className="text-amber-300">Delivery</span> em 2026.
                  </h1>
                  
                  <p className="text-white/70 text-base mb-6 leading-relaxed max-w-[400px]">
                    Transforme cliques amadores em vitrines profissionais que vendem muito mais no iFood.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.push('/estudio/ferramentas/aprimorar-prato')}
                      className="w-full sm:w-auto bg-white text-[#EA1D2C] px-8 py-3.5 rounded-2xl font-bold text-base shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-2.5 group"
                    >
                      <Sparkles size={18} className="fill-[#EA1D2C] group-hover:rotate-12 transition-transform" />
                      Testar Grátis Agora
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center relative">
                  {/* Before / After Showcase Cards — Maiores */}
                  <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center group/showcase">
                    {/* Card Original (Before) */}
                    <motion.div 
                      initial={{ rotate: -6, x: -35, opacity: 0 }}
                      animate={{ rotate: -6, x: -35, opacity: 1 }}
                      whileHover={{ rotate: -2, x: -55, zIndex: 40, scale: 1.05 }}
                      className="absolute w-[260px] aspect-[3/4] bg-white p-1.5 rounded-[20px] shadow-2xl z-20 border border-white/20 transition-all cursor-pointer group/card"
                    >
                      <img 
                        src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761958152/combo_AMERICAN-BURGUER_original_ls5ybn.jpg" 
                        className="w-full h-full object-cover rounded-[14px] grayscale-[0.2] brightness-90 group-hover/card:brightness-100 transition-all" 
                        alt="Foto original do prato — antes da IA" 
                      />
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        📱 Antes
                      </div>
                    </motion.div>

                    {/* Card IA (After) */}
                    <motion.div 
                      initial={{ rotate: 8, x: 35, opacity: 0 }}
                      animate={{ rotate: 8, x: 35, opacity: 1 }}
                      whileHover={{ rotate: 2, x: 55, zIndex: 40, scale: 1.05 }}
                      className="absolute w-[260px] aspect-[3/4] bg-white p-1.5 rounded-[20px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-30 border border-white/20 transition-all cursor-pointer group/card"
                    >
                      <img 
                        src="https://res.cloudinary.com/do8gdtozt/image/upload/v1769465007/download_19_kftypg.png" 
                        className="w-full h-full object-cover rounded-[14px] group-hover/card:scale-[1.02] transition-transform" 
                        alt="Foto profissional gerada pela IA" 
                      />
                      <div className="absolute top-3 right-3 bg-[#EA1D2C] text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg border border-white/10 flex items-center gap-1 uppercase tracking-wider">
                        <Sparkles size={10} /> IA
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Seção Gratuitas — Visitantes veem PRIMEIRO (Cavalo de Tróia) */}
        {isVisitor && (
          <section className="mt-2 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                  Ferramentas Gratuitas
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FreeToolCard 
                icon={<Type size={22} />}
                title="Gerador de Descrição iFood"
                desc="Textos que vendem mais com IA"
                onClick={() => router.push('/estudio/ferramentas/gerador-descricao-ifood')}
              />
              <FreeToolCard 
                icon={<Camera size={22} />}
                title="Foto iFood Ângulo 45º"
                desc="O ângulo que mais vende no app"
                onClick={() => router.push('/estudio/ferramentas/foto-ifood-angulo-45-graus')}
              />
              <FreeToolCard 
                icon={<LayoutTemplate size={22} />}
                title="Redimensionador iFood"
                desc="Ajuste capa, banner e destaque"
                onClick={() => router.push('/estudio/ferramentas/redimensionador-imagens-ifood')}
              />
            </div>
          </section>
        )}

        {/* Estúdio & Sabor Pro */}
        <section className={isVisitor ? "mb-8" : "mt-2 mb-6"}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500 fill-amber-500/30" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-display">
                Estúdio & Sabor Pro
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <PremiumToolCard 
              icon={<ImageIcon size={28} />}
              title="Aprimorar Prato"
              desc="Transforme qualquer foto em estúdio"
              credits={1}
              onClick={() => router.push('/estudio/ferramentas/aprimorar-prato')}
              accent="amber"
            />
            <PremiumToolCard 
              icon={<LayoutTemplate size={28} />}
              title="Post para Feed"
              desc="Imagem + legenda pronta para postar"
              credits={2}
              onClick={() => router.push('/estudio/ferramentas/gerador-post-feed-instagram')}
              accent="blue"
            />
            <PremiumToolCard 
              icon={<Flame size={28} />}
              title="Stories Animado"
              desc="Vertical 9:16 + texto de engajamento"
              credits={2}
              onClick={() => router.push('/estudio/ferramentas/gerador-stories-instagram')}
              accent="rose"
            />
            <PremiumToolCard 
              icon={<Star size={28} />}
              title="Kit Completo"
              desc="Feed + Story + Capa + textos de uma vez"
              credits={5}
              onClick={() => router.push('/estudio/ferramentas/gerador-kit-marketing-ifood')}
              accent="purple"
              featured
            />
          </div>
        </section>

        {/* Seção Gratuitas — Logados veem DEPOIS (já conhecem, foco no Pro) */}
        {!isVisitor && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                  Ferramentas Gratuitas
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FreeToolCard 
                icon={<Type size={22} />}
                title="Gerador de Descrição iFood"
                desc="Textos que vendem mais com IA"
                onClick={() => router.push('/estudio/ferramentas/gerador-descricao-ifood')}
              />
              <FreeToolCard 
                icon={<Camera size={22} />}
                title="Foto iFood Ângulo 45º"
                desc="O ângulo que mais vende no app"
                onClick={() => router.push('/estudio/ferramentas/foto-ifood-angulo-45-graus')}
              />
              <FreeToolCard 
                icon={<LayoutTemplate size={22} />}
                title="Redimensionador iFood"
                desc="Ajuste capa, banner e destaque"
                onClick={() => router.push('/estudio/ferramentas/redimensionador-imagens-ifood')}
              />
            </div>
          </section>
        )}

        {/* Recent Creations */}
        {recentCreations.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                Suas Criações Recentes
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentCreations.slice(0, 4).map((creation, index) => (
                <motion.div
                  key={creation.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setZoomedImage({ url: creation.image_url, label: creation.food_type, isAfter: true })}
                  className="group relative aspect-square rounded-[24px] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-pointer"
                >
                  <img
                    src={creation.image_url}
                    alt={creation.food_type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                    <p className="text-white font-bold text-sm truncate">{creation.food_type}</p>
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-1">
                      <Clock size={12} /> {formatTimeAgo(creation.created_at)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal Zoom */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            <img src={zoomedImage.url} alt={zoomedImage.label} className="max-h-[80vh] rounded-3xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

function FreeToolCard({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative bg-white border border-slate-200 p-6 rounded-3xl flex items-center gap-5 text-left transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 group"
    >
      <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
        Grátis
      </span>
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-100">
        {icon}
      </div>
      <div>
        <p className="text-base font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">{title}</p>
        <p className="text-xs font-medium text-slate-500">{desc}</p>
      </div>
    </motion.button>
  );
}

function PremiumToolCard({ icon, title, desc, credits, onClick, accent, featured = false }: { icon: React.ReactNode; title: string; desc: string; credits: number; onClick: () => void; accent: 'amber'|'blue'|'rose'|'purple'|'red'; featured?: boolean }) {
  const bgColors = {
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    red: "bg-red-50 text-[#EA1D2C] group-hover:bg-red-100"
  };

  const borderColors = {
    amber: "hover:border-amber-300 hover:shadow-amber-500/10",
    blue: "hover:border-blue-300 hover:shadow-blue-500/10",
    rose: "hover:border-rose-300 hover:shadow-rose-500/10",
    purple: "hover:border-purple-300 hover:shadow-purple-500/10",
    red: "hover:border-red-300 hover:shadow-[#EA1D2C]/10"
  };

  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`relative p-6 rounded-[28px] text-left transition-all border group bg-white ${
        featured ? "border-[#EA1D2C]/30 shadow-md shadow-[#EA1D2C]/5" : "border-[#EAEAEC] shadow-sm"
      } ${borderColors[accent]}`}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${bgColors[accent]}`}>
            {icon}
          </div>
          <div className="flex items-center gap-1.5 bg-[#F7F7F7] px-3 py-1.5 rounded-full border border-[#EAEAEC] text-[#3E3E3E]">
            <Zap size={12} className="fill-[#EA1D2C] text-[#EA1D2C]" />
            <span className="text-xs font-bold">{credits} {credits === 1 ? 'crédito' : 'créditos'}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <h4 className="text-lg font-bold text-[#1A1A1A] mb-1 leading-tight group-hover:text-[#EA1D2C] transition-colors">{title}</h4>
          <p className="text-sm font-medium text-[#717171]">{desc}</p>
        </div>
      </div>
    </motion.button>
  );
}
