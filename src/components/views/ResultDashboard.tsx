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
import type { UploadedImage, GenerationResult } from "@/app/page";

interface ResultDashboardProps {
  uploadedImage: UploadedImage;
  generationResult: GenerationResult;
  foodType: string;
  style: string;
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 px-[var(--space-page)] py-8"
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
              <div className="relative rounded-xl overflow-hidden border border-border-subtle bg-bg-surface">
                <div className="relative aspect-square">
                  <img
                    src={uploadedImage.preview}
                    alt="Foto original"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm uppercase tracking-wider">
                    Original
                  </span>
                </div>
              </div>

              {/* Generated */}
              <div className="relative rounded-xl overflow-hidden border border-pepper-orange/20 bg-bg-surface ring-1 ring-pepper-orange/10">
                <div className="relative aspect-square">
                  <img
                    src={generatedImageUrl}
                    alt="Imagem gerada pela IA"
                    className="object-cover w-full h-full"
                  />

                  {/* Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="rotate-[-30deg] select-none">
                      <p className="text-white/15 font-display font-black text-2xl sm:text-3xl tracking-widest uppercase whitespace-nowrap">
                        ESTÚDIO & SABOR
                      </p>
                      <p className="text-white/10 font-display font-black text-2xl sm:text-3xl tracking-widest uppercase whitespace-nowrap mt-8">
                        ESTÚDIO & SABOR
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-pepper-orange bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm uppercase tracking-wider">
                    ✨ IA
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
                    className="group relative flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-bg-surface hover:bg-bg-elevated transition-all focus-ring"
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
                  className="p-4 rounded-xl border border-border-subtle bg-bg-surface group"
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
              <div className="absolute inset-0 bg-gradient-to-br from-pepper-red/20 via-bg-surface to-pepper-orange/10 border border-pepper-red/20 rounded-2xl" />
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
                    className="w-full py-3 px-6 rounded-xl border border-border-default text-text-secondary font-semibold text-sm hover:bg-white/5 transition-all focus-ring"
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
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border-subtle text-text-muted hover:text-text-primary hover:border-white/15 transition-all text-sm font-medium focus-ring"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowPaywall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-bg-elevated rounded-3xl border border-border-default p-8 max-w-md w-full relative"
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
