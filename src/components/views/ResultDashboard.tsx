"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
  FileDown
} from "lucide-react";
import type { UploadedImage, GenerationResult } from "@/types/app";

interface ResultDashboardProps {
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

  // Professionalism Index Logic (Heuristic based on documented criteria)
  const professionalismScore = useMemo(() => {
    let score = 42; // Base smartphone quality benchmark
    
    // Logic based on technical improvements applied:
    if (generationResult.base64Image) {
      score += 30; // Background Removal/Replacement (+30%)
      score += 26; // Studio Lighting/Color Grading (+26%)
    }
    
    // Final polish based on framing/format
    if (format === "1:1") score += 2; // Optimal for iFood conversion
    
    return Math.min(score, 98); // Cap at 98%
  }, [generationResult, format]);

  const generatedImageUrl = useMemo(() => {
    return `data:${generationResult.mimeType};base64,${generationResult.base64Image}`;
  }, [generationResult]);

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
      // Se for gratuito (ou já pago na geração), apenas simula o download
      if (dest.cost === 0) {
        // Logica de download aqui
        alert(`Preparando download para ${dest.label}...`);
      } else {
        // Consumir créditos atômicos
        const { data: newBalance, error } = await supabase.rpc('consume_credits', {
          p_service_type: dest.id
        });

        if (error) throw new Error(error.message);
        
        setUserCredits(newBalance);
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
    const mainCopy = generationResult.copyTexts[0]?.text || "";
    const text = encodeURIComponent(`🚀 Confira o novo material profissional do meu restaurante gerado pelo Estúdio & Sabor!\n\n"${mainCopy}"\n\n#iFood #MarketingDigital`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleDownloadMain = () => {
    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = `estudio-sabor-${foodType}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLockedAction = () => {
    setShowPaywall(true);
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
        // Redirecionar para o Checkout do Mercado Pago
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 px-[var(--space-page)] py-8 overflow-y-auto bg-[#F7F7F7]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with Professionalism Score */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles size={14} />
              Processamento concluído
            </div>
            <h2 className="font-bold text-3xl text-[#3E3E3E] tracking-tight">
              Seu material profissional está pronto
            </h2>
            <p className="text-[#717171] mt-1 font-medium">Otimizado para converter {foodLabels[foodType] || foodType} em vendas.</p>
          </div>

          {/* Professionalism Score Gauge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-4 rounded-2xl border border-[#EAEAEC] shadow-sm flex items-center gap-4 min-w-[280px]"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32" cy="32" r="28"
                  fill="transparent"
                  stroke="#F7F7F7"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="32" cy="32" r="28"
                  fill="transparent"
                  stroke={professionalismScore > 90 ? "#22C55E" : "#EA1D2C"}
                  strokeWidth="6"
                  strokeDasharray={176}
                  initial={{ strokeDashoffset: 176 }}
                  animate={{ strokeDashoffset: 176 - (176 * professionalismScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-black text-[#3E3E3E]">{professionalismScore}%</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-0.5">Score de Profissionalismo</p>
              <p className="text-sm font-bold text-[#3E3E3E]">
                {professionalismScore > 90 ? "Nível Franqueadora" : "Potencial de Melhoria"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={10} className={s <= Math.round(professionalismScore/20) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Main Image + Destinations */}
          <div className="flex flex-col gap-6">
            {/* Before/After Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Original */}
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#EAEAEC] bg-white flex items-center justify-center">
                <div className={`relative w-full ${aspectClass}`}>
                  <img
                    src={uploadedImage.preview}
                    alt="Foto original"
                    className="object-contain w-full h-full opacity-60 blur-sm absolute inset-0"
                  />
                  <img
                    src={uploadedImage.preview}
                    alt="Foto original"
                    className="object-contain w-full h-full relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm uppercase tracking-wider z-20">
                    Sua Foto
                  </span>
                </div>
              </div>

              {/* Generated Mockup */}
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#EAEAEC] bg-white flex items-center justify-center group">
                <div className={`relative w-full ${aspectClass} overflow-hidden`}>
                  <img
                    src={generatedImageUrl}
                    alt="Imagem gerada pela IA"
                    className="object-cover w-full h-full"
                  />

                  {/* Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30 mix-blend-overlay">
                    <div className="rotate-[-30deg] select-none">
                      <p className="text-white font-black text-xl sm:text-2xl tracking-widest uppercase whitespace-nowrap drop-shadow-md">
                        ESTÚDIO & SABOR
                      </p>
                    </div>
                  </div>

                  {/* MOCKUP UI OVERLAYS (Keep the same logic) */}
                  {format === "9:16" && (
                    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-20">
                      <div className="px-4 py-2 w-11/12 rounded-lg bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#EA1D2C]">
                           <ShoppingBag size={14} />
                           <span className="text-[#3E3E3E] text-[10px] font-bold uppercase tracking-tight">Ver no iFood</span>
                        </div>
                        <span className="text-[#EA1D2C] font-black text-[10px] uppercase">Pedir Agora</span>
                      </div>
                    </div>
                  )}

                  <span className="absolute top-2 right-2 text-[9px] font-bold text-[#EA1D2C] bg-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wider z-20 flex items-center gap-1">
                    <Sparkles size={10} /> Resultado IA
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="mt-4">
              <h3 className="font-bold text-sm text-[#3E3E3E] mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Layout size={16} className="text-[#EA1D2C]" />
                Onde você quer postar?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destinations.map((dest) => {
                  const Icon = dest.icon;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => handleExport(dest)}
                      disabled={exportingId === dest.id}
                      className="group flex items-center gap-3 p-4 rounded-xl transition-all shadow-sm border bg-white border-[#EAEAEC] hover:border-[#EA1D2C] hover:bg-red-50/30 disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#F7F7F7] group-hover:bg-[#EA1D2C]/10 text-[#717171] group-hover:text-[#EA1D2C] flex items-center justify-center transition-colors">
                        <Icon size={20} />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#3E3E3E] flex items-center gap-1.5">
                          {dest.label}
                          {dest.premium && <Crown size={12} className="text-yellow-500" />}
                        </p>
                        <p className="text-[#717171] text-[11px] font-medium truncate">
                          {dest.desc}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-[#EA1D2C] bg-red-50 px-2 py-0.5 rounded">
                          {dest.cost} {dest.cost === 1 ? "crédito" : "créditos"}
                        </span>
                        <Download size={14} className="text-gray-300 group-hover:text-[#EA1D2C]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Copywriting + CTA */}
          <div className="flex flex-col gap-6">
            {/* Copywriting Selection */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-sm text-[#3E3E3E] flex items-center gap-2 uppercase tracking-widest">
                <Sparkles size={16} className="text-[#EA1D2C]" />
                Cativar Clientes
              </h3>

              {generationResult.copyTexts.map((copy) => (
                <div
                  key={copy.id}
                  className="p-5 rounded-2xl bg-white border border-[#EAEAEC] shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#EA1D2C]">
                      {copy.label}
                    </span>
                    <button
                      onClick={() => handleCopy(copy.text, copy.id)}
                      className="text-[#717171] hover:text-[#EA1D2C] transition-colors"
                    >
                      {copiedId === copy.id ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="text-[#3E3E3E] text-sm leading-relaxed font-medium italic">
                    &quot;{copy.text}&quot;
                  </p>
                </div>
              ))}
            </div>

            {/* Wallet / Credits Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative rounded-2xl overflow-hidden border border-[#EAEAEC] shadow-sm bg-white"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#EA1D2C]" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#EA1D2C]">
                       <ShoppingBag size={18} />
                    </div>
                    <span className="font-bold text-sm text-[#3E3E3E]">Seu Saldo</span>
                  </div>
                  <span className="text-xl font-black text-[#EA1D2C]">
                    {userCredits} <span className="text-xs text-[#717171] uppercase">créditos</span>
                  </span>
                </div>
                
                <p className="text-[#717171] text-xs mb-6 font-medium">
                  Seus créditos de teste expiram em <span className="text-[#EA1D2C] font-bold">72 horas</span>. Aproveite para turbinar seu cardápio!
                </p>

                <button
                  onClick={() => initiateCheckout('agencia')}
                  disabled={!!loadingCheckout}
                  className="w-full py-3.5 rounded-xl bg-[#EA1D2C] hover:bg-[#D01925] text-white font-bold text-sm shadow-md shadow-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingCheckout === 'agencia' ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Crown size={16} />
                  )}
                  Comprar 30 Créditos
                </button>
                <button
                  onClick={() => setShowPaywall(true)}
                  className="w-full mt-2 py-3 rounded-xl bg-white border border-[#EAEAEC] hover:bg-gray-50 text-[#3E3E3E] font-bold text-sm transition-all"
                >
                  Ver todos os pacotes
                </button>
              </div>
            </motion.div>

            {/* Action Buttons — The 'Closing' of the workflow */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareWhatsApp}
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5b] text-white font-bold text-base shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} />
                Compartilhar no WhatsApp
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadMain}
                className="w-full py-4 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <FileDown size={20} />
                Download Alta Resolução
              </motion.button>
            </div>

            <button
              onClick={onNewPackage}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-[#717171] hover:text-[#EA1D2C] transition-all text-xs font-bold border border-transparent hover:border-red-100 mt-2"
            >
              <RefreshCw size={14} />
              Refazer com outro estilo
            </button>
          </div>
        </div>
      </div>

      {/* Paywall Modal (Simplified for Demo) */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E3E3E]/60 backdrop-blur-md"
          onClick={() => setShowPaywall(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full relative shadow-2xl border border-[#EAEAEC]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-6 right-6 text-[#717171] hover:text-[#EA1D2C] transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#EA1D2C] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-100">
                <Crown size={32} className="text-white" />
              </div>
              <h3 className="font-bold text-2xl text-[#3E3E3E] mb-2 tracking-tight">
                Turbine suas vendas agora
              </h3>
              <p className="text-[#717171] text-sm font-medium">
                Escolha o pacote ideal para o seu restaurante. Créditos sem expiração.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { id: 'emergencia', name: 'Emergência', credits: 10, price: '29,90' },
                { id: 'agencia', name: 'Agência', credits: 30, price: '59,90', popular: true },
                { id: 'imperio', name: 'Império Pro', credits: 100, price: '149,90' }
              ].map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center ${
                    pkg.popular ? 'border-[#EA1D2C] bg-red-50/30' : 'border-[#EAEAEC] hover:border-[#EA1D2C]/30'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#EA1D2C] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Mais Popular
                    </span>
                  )}
                  <p className="text-[10px] font-black text-[#717171] uppercase tracking-[0.2em] mb-2">
                    {pkg.name}
                  </p>
                  <p className="text-3xl font-black text-[#3E3E3E] mb-1">
                    {pkg.credits}
                  </p>
                  <p className="text-[10px] font-bold text-[#717171] uppercase mb-4">
                    Créditos
                  </p>
                  <p className="text-xl font-black text-[#EA1D2C] mb-6">
                    R$ {pkg.price}
                  </p>
                  <button
                    onClick={() => initiateCheckout(pkg.id)}
                    disabled={!!loadingCheckout}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      pkg.popular 
                        ? 'bg-[#EA1D2C] text-white shadow-md hover:brightness-110' 
                        : 'bg-white border border-[#EAEAEC] text-[#3E3E3E] hover:border-[#EA1D2C] hover:text-[#EA1D2C]'
                    }`}
                  >
                    {loadingCheckout === pkg.id ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      'Escolher'
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#F2F2F2]">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">Acesso Instantâneo</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">Checkout Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span className="text-[10px] font-bold text-[#717171] uppercase tracking-wider">PIX / Cartão</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
