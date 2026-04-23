"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import type { UploadedImage, GenerationResult } from "@/types/app";

interface ResultDashboardProps {
  uploadedImage: UploadedImage;
  generationResult: GenerationResult;
  foodType: string;
  style: string;
  format: string;
  onNewPackage: () => void;
}

// Export formats (locked behind paywall)
const exportFormats = [
  {
    id: "quadrada",
    label: "Foto Cardápio",
    size: "1080×1080",
    ratio: "1:1",
    icon: ImageIcon,
    desc: "Feed & Cardápio iFood",
  },
  {
    id: "capa",
    label: "Capa iFood",
    size: "800×200",
    ratio: "4:1",
    icon: Layout,
    desc: "Banner topo da loja",
  },
  {
    id: "stories",
    label: "Stories",
    size: "1080×1920",
    ratio: "9:16",
    icon: Smartphone,
    desc: "Instagram & WhatsApp",
  },
];

const styleLabels: Record<string, string> = {
  rustico: "Rústico",
  "premium-escuro": "Premium Escuro",
  clean: "Clean",
  gourmet: "Gourmet",
};

const foodLabels: Record<string, string> = {
  pizza: "Pizza",
  hamburger: "Hambúrguer",
  sushi: "Sushi",
  sobremesa: "Sobremesa",
  salada: "Salada",
  cafe: "Café",
  lanche: "Lanche",
  "prato-feito": "Prato Feito",
};

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

  // Build the data URL for the generated image
  const generatedImageUrl = useMemo(() => {
    return `data:${generationResult.mimeType};base64,${generationResult.base64Image}`;
  }, [generationResult]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLockedAction = () => {
    setShowPaywall(true);
  };

  // Determine aspect ratio for containers
  const aspectClass = 
    format === "stories" ? "aspect-[9/16]" :
    format === "capa" ? "aspect-[4/1]" : "aspect-square";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 px-[var(--space-page)] py-8 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles size={14} />
            Pacote gerado com sucesso!
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">
            Seu pacote de marketing está pronto
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Main Image + Exports */}
          <div className="flex flex-col gap-6">
            {/* Before/After Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              {/* Original */}
              <div className="relative rounded-xl overflow-hidden shadow-lg bg-bg-surface flex items-center justify-center bg-black/20">
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
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white/70 bg-bg-elevated/40 px-2 py-0.5 rounded-md backdrop-blur-sm uppercase tracking-wider z-20">
                    Original
                  </span>
                </div>
              </div>

              {/* Generated Mockup */}
              <div className="relative rounded-xl overflow-hidden shadow-xl bg-bg-surface ring-1 ring-pepper-orange/30 flex items-center justify-center bg-black/20 group">
                <div className={`relative w-full ${aspectClass}`}>
                  <img
                    src={generatedImageUrl}
                    alt="Imagem gerada pela IA"
                    className="object-cover w-full h-full"
                  />

                  {/* Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-60">
                    <div className="rotate-[-30deg] select-none">
                      <p className="text-white/20 font-display font-black text-xl sm:text-2xl tracking-widest uppercase whitespace-nowrap drop-shadow-md">
                        ESTÚDIO & SABOR
                      </p>
                      <p className="text-white/10 font-display font-black text-xl sm:text-2xl tracking-widest uppercase whitespace-nowrap mt-8 drop-shadow-md">
                        ESTÚDIO & SABOR
                      </p>
                    </div>
                  </div>

                  {/* MOCKUP UI OVERLAYS */}
                  {format === "stories" && (
                    <>
                      <div className="absolute top-0 left-0 right-0 p-3 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent z-20">
                        <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden border border-white/40 flex-shrink-0" />
                        <span className="text-white text-[10px] font-bold drop-shadow-md">Seu Restaurante</span>
                        <span className="text-white/80 text-[10px] ml-auto drop-shadow-md">Agora</span>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                        <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold shadow-lg">
                          Ver Cardápio
                        </div>
                      </div>
                    </>
                  )}

                  {format === "capa" && (
                    <>
                      <div className="absolute -bottom-3 sm:-bottom-6 left-4 sm:left-6 w-8 h-8 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 border-bg-surface bg-bg-elevated z-20" />
                      <div className="absolute bottom-1 sm:bottom-2 left-14 sm:left-24 text-white text-[8px] sm:text-xs font-bold drop-shadow-md z-20">
                        Seu Restaurante
                      </div>
                    </>
                  )}

                  {format === "quadrada" && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 flex flex-col justify-end">
                         <h4 className="text-white text-[11px] sm:text-sm font-bold leading-tight drop-shadow-md">{foodLabels[foodType] || "Prato Premium"}</h4>
                         <p className="text-white/80 text-[9px] sm:text-xs line-clamp-1 sm:line-clamp-2 mt-0.5 drop-shadow-md">O sabor que você esperava, agora no iFood.</p>
                         <p className="text-green-400 font-bold text-[10px] sm:text-sm mt-1 drop-shadow-md">R$ 39,90</p>
                      </div>
                    </>
                  )}

                  <span className="absolute top-2 right-2 text-[10px] font-bold text-pepper-orange bg-bg-elevated/80 px-2 py-0.5 rounded-md backdrop-blur-md uppercase tracking-wider z-20 flex items-center gap-1 shadow-lg border border-pepper-orange/20">
                    <Sparkles size={10} /> IA Mockup
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Style/Food badges */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold glass text-pepper-orange uppercase tracking-wider">
                {styleLabels[style] || style}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold glass text-text-secondary uppercase tracking-wider">
                {foodLabels[foodType] || foodType}
              </span>
            </div>

            {/* Export Buttons (locked) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={handleLockedAction}
                    className="group relative flex items-center gap-3 p-4 rounded-xl bg-bg-surface hover:bg-bg-elevated transition-all shadow-sm hover:shadow-md focus-ring"
                    id={`export-${format.id}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-muted group-hover:text-pepper-orange transition-colors">
                      <Icon size={20} />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                        {format.label}
                        <Lock size={12} className="text-pepper-orange" />
                      </p>
                      <p className="text-text-muted text-[11px]">
                        {format.size} · {format.desc}
                      </p>
                    </div>
                    <Download
                      size={16}
                      className="text-text-muted group-hover:text-pepper-orange transition-colors"
                    />
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Right: Copywriting + CTA */}
          <div className="flex flex-col gap-6">
            {/* AI Copywriting Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <h3 className="font-display font-bold text-base text-text-primary flex items-center gap-2">
                <Sparkles size={16} className="text-pepper-orange" />
                Textos Descritivos (Neuro-Copy)
              </h3>

              {generationResult.copyTexts.map((copy) => (
                <div
                  key={copy.id}
                  className="p-4 rounded-xl bg-bg-surface group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pepper-orange">
                      {copy.label}
                    </span>
                    <button
                      onClick={() => handleCopy(copy.text, copy.id)}
                      className="flex items-center gap-1 text-[11px] font-medium text-text-muted hover:text-text-primary transition-colors focus-ring rounded px-1.5 py-0.5"
                      id={`copy-text-${copy.id}`}
                    >
                      {copiedId === copy.id ? (
                        <>
                          <Check size={12} className="text-green-400" />
                          <span className="text-green-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {copy.text}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Paywall CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pepper-red/20 via-bg-surface to-pepper-orange/10 rounded-2xl" />
              <div className="relative p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pepper-red to-pepper-orange flex items-center justify-center mb-4 shadow-lg shadow-pepper-red/30 animate-pulse-glow">
                  <Crown size={24} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                  Gostou do resultado?
                </h3>
                <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                  Desbloqueie em alta resolução sem marca d&apos;água ou assine
                  o plano ilimitado.
                </p>
                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    onClick={handleLockedAction}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-bold text-sm shadow-lg shadow-pepper-red/25 hover:shadow-pepper-red/40 transition-all active:scale-[0.98] focus-ring"
                    id="paywall-subscribe-btn"
                  >
                    Assinar Ilimitado — R$ 49/mês
                  </button>
                  <button
                    onClick={handleLockedAction}
                    className="w-full py-3 px-6 rounded-xl bg-bg-elevated text-text-secondary font-semibold text-sm hover:bg-bg-main transition-all focus-ring"
                    id="paywall-single-btn"
                  >
                    Desbloquear este pacote — R$ 9,90
                  </button>
                </div>
                <p className="text-text-muted text-[10px] mt-3">
                  Cancele quando quiser. Sem compromisso.
                </p>
              </div>
            </motion.div>

            {/* New Package */}
            <button
              onClick={onNewPackage}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-text-muted hover:text-text-primary transition-all text-sm font-medium focus-ring"
              id="new-package-btn"
            >
              <RefreshCw size={14} />
              Criar outro pacote
            </button>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-md"
          onClick={() => setShowPaywall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-bg-surface rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors focus-ring rounded-lg p-1"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pepper-red to-pepper-orange flex items-center justify-center mx-auto mb-5 shadow-xl shadow-pepper-red/30">
                <Lock size={28} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                Funcionalidade Premium
              </h3>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                A integração com pagamento será ativada na Etapa 3. Por
                enquanto, esta é uma demonstração do fluxo de conversão.
              </p>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-text-primary font-semibold text-sm transition-all focus-ring"
              >
                Entendi, fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
