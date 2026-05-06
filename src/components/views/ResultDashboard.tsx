"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase/client";
import {
  Download,
  Lock,
  Copy,
  Check,
  RefreshCw,
  Crown,
  ImageIcon,
  Layout,
  Smartphone,
  Sparkles,
  X,
  Heart,
  Clock,
  Star,
  ShoppingBag,
  Share2,
  MessageCircle,
  FileDown,
  TrendingUp,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import type { UploadedImage, GenerationResult } from "@/types/app";

interface ResultDashboardProps {
  user: User;
  uploadedImage: UploadedImage;
  generationResult: GenerationResult;
  foodType: string;
  style: string;
  format: string; // "1:1", "16:9", "9:16", "4:3"
  onNewPackage: () => void;
}

const foodLabels: Record<string, string> = {
  burger: "Hambúrguer",
  pizza: "Pizza",
  sushi: "Sushi",
  pasta: "Massa",
  salad: "Salada",
  dessert: "Sobremesa",
  drink: "Bebida",
  other: "Prato",
};

// Export formats and destinations with credit costs
const destinations = [
  {
    id: "resize_compression",
    label: "Cardápio iFood",
    size: "1:1 • 1080px",
    icon: ImageIcon,
    desc: "Otimizado para o catálogo",
    cost: 1,
    premium: false,
  },
  {
    id: "full_kit_promo",
    label: "Capa da Loja",
    size: "16:9 • 800px",
    icon: Layout,
    desc: "Banner de destaque",
    cost: 25,
    premium: true,
  },
  {
    id: "whatsapp_banner",
    label: "Promoção WhatsApp",
    size: "9:16 • Banner",
    icon: Sparkles,
    desc: "Ideal para listas de transmissão",
    cost: 10,
    premium: true,
  },
  {
    id: "instagram_stories",
    label: "Insta Stories",
    size: "9:16 • Mockup",
    icon: Smartphone,
    desc: "Engajamento e Branding",
    cost: 10,
    premium: true,
  },
];

export function ResultDashboard({
  user,
  uploadedImage,
  generationResult,
  foodType,
  style,
  format,
  onNewPackage,
}: ResultDashboardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "copy">("visual");
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  const { userCredits, setUserCredits } = useDashboard();
  const supabase = createClient();

  // Professionalism Index Logic
  const professionalismScore = useMemo(() => {
    let score = 42;
    if (generationResult.imageUrl) {
      score += 30;
      score += 26;
    }
    if (format === "1:1") score += 2;
    return Math.min(score, 98);
  }, [generationResult, format]);

  const generatedImageUrl = generationResult.imageUrl;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = async (dest: typeof destinations[0]) => {
    if (dest.cost > userCredits) {
      setShowPaywall(true);
      return;
    }

    setExportingId(dest.id);

    try {
      if (dest.cost === 0) {
        alert(`Preparando download para ${dest.label}...`);
      } else {
        const { data: rpcResponse, error } = await supabase.rpc('consume_credits', {
          p_user_id: user.id,
          p_service_id: dest.id,
          p_reference_id: `export_${dest.id}_${Date.now()}`
        });

        if (error) throw new Error(error.message);

        const creditResult = rpcResponse as { success: boolean; error?: string; remaining_credits?: number };
        if (!creditResult.success) {
          throw new Error(creditResult.error || 'Saldo insuficiente.');
        }

        if (creditResult.remaining_credits !== undefined) {
          setUserCredits(creditResult.remaining_credits);
        }
        alert(`✅ ${dest.label} gerado com sucesso!`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Erro ao processar exportação.");
    } finally {
      setExportingId(null);
    }
  };

  const handleShareWhatsApp = () => {
    const mainCopy = generationResult.copyTexts?.[0]?.text || "";
    const text = encodeURIComponent(`🚀 Confira o novo material profissional do meu restaurante gerado pelo Estúdio & Sabor!\n\n"${mainCopy}"\n\n#iFood #MarketingDigital`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleDownloadMain = async () => {
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `estudio-sabor-${foodType}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(generatedImageUrl, "_blank");
    }
  };

  const initiateCheckout = async (packageId: string) => {
    if (user.id === 'mock-temporario') {
      alert('Você está no Modo Demonstração. Para realizar uma compra real, por favor, faça login ou crie uma conta.');
      return;
    }
    setLoadingCheckout(packageId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Erro ao gerar checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Não foi possível iniciar o pagamento. Tente novamente.');
    } finally {
      setLoadingCheckout(null);
    }
  };

  const aspectClass =
    format === "9:16" ? "aspect-[9/16]" :
      format === "16:9" ? "aspect-[16/9]" :
        format === "4:3" ? "aspect-[4/3]" : "aspect-square";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "circOut" }}
      className="flex-1 px-6 md:px-10 py-10 overflow-y-auto bg-brand-dark relative"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Professionalism Score */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="flex-1 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-brand-surface border border-white/10 text-brand-orange text-[10px] font-black tracking-[0.2em] uppercase shadow-xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              Processamento de Elite Concluído
            </motion.div>
            <h2 className="font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tighter leading-[0.9]">
              Material <span className="text-transparent bg-clip-text bg-brand-gradient">Premium</span> <br />
              Pronto para Vender
            </h2>
            <p className="text-white/40 font-medium text-lg max-w-xl">
              Aplicamos nossa inteligência de conversão para elevar sua {foodLabels[foodType] || foodType} ao nível das maiores franquias do mundo.
            </p>
          </div>

          {/* Professionalism Score Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-surface p-8 rounded-[40px] border border-white/5 shadow-2xl flex items-center gap-8 min-w-[360px] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.02] transition-opacity" />
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48" cy="48" r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="48" cy="48" r="42"
                  fill="none"
                  stroke="url(#impact-score-gradient)"
                  strokeWidth="10"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * professionalismScore) / 100 }}
                  transition={{ duration: 2, ease: "circOut" }}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(234,29,44,0.4)]"
                />
                <defs>
                  <linearGradient id="impact-score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EA1D2C" />
                    <stop offset="100%" stopColor="#FC6803" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{professionalismScore}</span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest -mt-1">Pontos</span>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-2">Score de Impacto</p>
              <p className="text-xl font-black text-white tracking-tight">
                {professionalismScore > 90 ? "Franqueadora" : "Alta Conversão"}
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(professionalismScore / 20) ? "text-brand-orange fill-brand-orange" : "text-white/5"} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12">
          {/* Left: Main Image + Destinations */}
          <div className="space-y-12">
            {/* Before/After Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Original */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="group relative rounded-[40px] overflow-hidden border border-white/5 bg-brand-surface/30 p-4"
              >
                <div className={`relative w-full ${aspectClass} rounded-[32px] overflow-hidden bg-brand-dark/50 flex items-center justify-center`}>
                  <img
                    src={uploadedImage.preview}
                    alt="Foto original"
                    className="object-contain w-full h-full opacity-20 blur-2xl absolute inset-0 scale-150"
                  />
                  <img
                    src={uploadedImage.preview}
                    alt="Foto original"
                    className="object-contain max-h-[80%] max-w-[80%] relative z-10 p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent z-20" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/5 z-30">
                    <Clock size={12} className="text-white/40" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Antes do Estúdio</span>
                  </div>
                </div>
              </motion.div>

              {/* Generated Mockup */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="group relative rounded-[40px] overflow-hidden border border-white/10 bg-brand-surface p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className={`relative w-full ${aspectClass} rounded-[32px] overflow-hidden bg-brand-dark`}>
                  <img
                    src={generatedImageUrl}
                    alt="Imagem gerada pela IA"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* High Quality Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/10 via-transparent to-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity mix-blend-overlay">
                    <div className="rotate-[-25deg] select-none">
                      <p className="text-white font-black text-4xl tracking-[0.8em] uppercase whitespace-nowrap">
                        PROPRIEDADE INTELECTUAL • ESTÚDIO & SABOR
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-gradient shadow-2xl z-30">
                    <Sparkles size={14} className="text-white animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Resultado Premium IA</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-lg text-white flex items-center gap-4 uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-10 bg-brand-gradient rounded-full" />
                  Formatos Estratégicos
                </h3>
                <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/5">
                  Full Kit Disponível
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {destinations.map((dest) => {
                  const Icon = dest.icon;
                  const isExporting = exportingId === dest.id;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => handleExport(dest)}
                      disabled={isExporting}
                      className="group flex items-center gap-6 p-6 rounded-[32px] transition-all bg-brand-surface border border-white/5 hover:border-brand-orange/40 hover:bg-brand-surface/80 disabled:opacity-50 relative overflow-hidden text-left"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${dest.premium ? "bg-brand-gradient text-white shadow-lg" : "bg-brand-dark border border-white/5 text-white/40 group-hover:text-brand-orange group-hover:border-brand-orange/20"}`}>
                        <Icon size={26} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-black text-white tracking-tight leading-none">
                            {dest.label}
                          </p>
                          {dest.premium && <Crown size={12} className="text-brand-yellow" />}
                        </div>
                        <p className="text-white/40 text-xs font-medium truncate">
                          {dest.desc}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                         <div className="px-3 py-1.5 rounded-xl bg-brand-dark/50 border border-white/5 text-[9px] font-black text-brand-orange uppercase tracking-widest">
                          {dest.cost} {dest.cost === 1 ? "crédito" : "créditos"}
                        </div>
                        {isExporting ? (
                          <RefreshCw size={20} className="text-brand-orange animate-spin" />
                        ) : (
                          <Download size={20} className="text-white/20 group-hover:text-brand-orange transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Copywriting + CTA */}
          <div className="space-y-10">
            {/* Action Buttons (High Priority) */}
            <div className="flex flex-col gap-5">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadMain}
                className="group relative w-full py-6 rounded-[24px] bg-white text-brand-dark font-black text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                <FileDown size={24} className="group-hover:translate-y-0.5 transition-transform" />
                Download Alta Definição
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareWhatsApp}
                className="group w-full py-5 rounded-[24px] bg-[#25D366] hover:brightness-110 text-white font-black text-base shadow-[0_15px_35px_rgba(37,211,102,0.2)] transition-all flex items-center justify-center gap-4"
              >
                <MessageCircle size={24} />
                Enviar para WhatsApp
              </motion.button>
            </div>

            {/* Wallet / Credits Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-[40px] overflow-hidden border border-white/5 bg-brand-surface shadow-2xl group p-8"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-gradient" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-red/5 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center text-brand-orange border border-white/5">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <span className="font-black text-[10px] text-white/20 uppercase tracking-[0.3em] block mb-1">Seu Saldo</span>
                      <span className="text-3xl font-black text-white tracking-tighter">
                        {userCredits} <span className="text-[10px] text-white/40 uppercase tracking-widest ml-1">Créditos</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                     <Star size={14} className="text-brand-orange" />
                     <span>Créditos vitalícios • Nunca expiram</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                     <Star size={14} className="text-brand-orange" />
                     <span>Acesso a todos os formatos premium</span>
                   </div>
                </div>

                <button
                  onClick={() => initiateCheckout('agencia')}
                  disabled={!!loadingCheckout}
                  className="w-full py-5 rounded-2xl bg-brand-gradient text-white font-black text-sm shadow-[0_15px_40px_rgba(234,29,44,0.3)] hover:shadow-[0_20px_50px_rgba(234,29,44,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em]"
                >
                  {loadingCheckout === 'agencia' ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  Turbinar meu Saldo
                </button>
                
                <button
                  onClick={() => setShowPaywall(true)}
                  className="w-full mt-4 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black text-[10px] transition-all uppercase tracking-[0.3em]"
                >
                  Ver Mais Planos
                </button>
              </div>
            </motion.div>

            {/* Copywriting Selection */}
            {generationResult.copyTexts && generationResult.copyTexts.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-black text-sm text-white flex items-center gap-4 uppercase tracking-[0.3em]">
                  <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                  Legendas de Alta Conversão
                </h3>

                <div className="space-y-4">
                  {generationResult.copyTexts.map((copy) => (
                    <motion.div
                      key={copy.id}
                      whileHover={{ x: 5 }}
                      className="p-8 rounded-[32px] bg-brand-surface border border-white/5 hover:border-white/10 transition-all relative group"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-brand-orange" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                            {copy.label}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(copy.text, copy.id)}
                          className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-white/20 hover:text-brand-orange hover:border-brand-orange/20 border border-transparent transition-all"
                        >
                          {copiedId === copy.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                      <p className="text-white/60 text-base leading-relaxed font-bold tracking-tight italic">
                        &quot;{copy.text}&quot;
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onNewPackage}
              className="w-full flex items-center justify-center gap-3 py-6 rounded-3xl text-white/20 hover:text-brand-red transition-all text-[11px] font-black uppercase tracking-[0.3em] border border-dashed border-white/10 hover:border-brand-red/30"
            >
              <RefreshCw size={16} />
              Refazer Processamento
            </button>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/95 backdrop-blur-2xl"
            onClick={() => setShowPaywall(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-brand-surface rounded-[48px] p-12 max-w-4xl w-full relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Ambience */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />

              <button
                onClick={() => setShowPaywall(false)}
                className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>

              <div className="text-center mb-16">
                <div className="w-24 h-24 rounded-[32px] bg-brand-gradient flex items-center justify-center mx-auto mb-8 shadow-[0_25px_50px_rgba(234,29,44,0.3)] rotate-3">
                  <Crown size={48} className="text-white" />
                </div>
                <h3 className="font-black text-4xl md:text-5xl text-white mb-4 tracking-tighter">
                  Impulsione seu <span className="text-transparent bg-clip-text bg-brand-gradient">Restaurante</span>
                </h3>
                <p className="text-white/40 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                  Escolha o arsenal ideal para dominar os apps de delivery. Créditos vitalícios para usar quando quiser.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                  { id: 'emergencia', name: 'Kit Starter', credits: 10, price: '29,90', icon: Rocket },
                  { id: 'agencia', name: 'Business Pro', credits: 30, price: '59,90', popular: true, icon: Star },
                  { id: 'imperio', name: 'Elite Force', credits: 100, price: '149,90', icon: Crown }
                ].map((pkg) => {
                  const PkgIcon = pkg.icon;
                  return (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ y: -10 }}
                      className={`relative p-8 rounded-[40px] border-2 transition-all flex flex-col items-center group ${pkg.popular ? 'border-brand-red bg-brand-red/5 shadow-[0_20px_50px_rgba(234,29,44,0.1)]' : 'border-white/5 hover:border-white/10 bg-brand-dark/40'
                        }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-brand-gradient text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl z-20">
                          Recomendado
                        </div>
                      )}
                      
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${pkg.popular ? "bg-brand-gradient text-white" : "bg-brand-surface text-white/20 group-hover:text-brand-orange"}`}>
                        <PkgIcon size={32} />
                      </div>
                      
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">
                        {pkg.name}
                      </p>
                      <div className="text-center mb-8">
                        <p className="text-5xl font-black text-white tracking-tighter mb-1">
                          {pkg.credits}
                        </p>
                        <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">
                          Créditos
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1 mb-10">
                        <span className="text-white/40 text-xs font-bold uppercase">R$</span>
                        <p className="text-3xl font-black text-white tracking-tight">
                          {pkg.price}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => initiateCheckout(pkg.id)}
                        disabled={!!loadingCheckout}
                        className={`w-full py-5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] ${pkg.popular
                            ? 'bg-brand-gradient text-white shadow-2xl hover:scale-[1.02]'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                          }`}
                      >
                        {loadingCheckout === pkg.id ? (
                          <RefreshCw size={20} className="animate-spin" />
                        ) : (
                          'Ativar Agora'
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-10 border-t border-white/5">
                {[
                  { icon: ShieldCheck, label: "Checkout Seguro" },
                  { icon: Sparkles, label: "Entrega Imediata" },
                  { icon: Share2, label: "Pix e Cartão" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon size={20} className="text-brand-orange" />
                    <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
