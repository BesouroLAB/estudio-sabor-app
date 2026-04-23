"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wand2,
  ShoppingBag,
  Layout,
  Smartphone,
  Megaphone,
  ImageIcon,
  BookOpen,
  Sparkles,
  Loader2,
  Camera,
  Layers,
  Maximize2,
  Monitor,
  Square,
  Sun
} from "lucide-react";
import { FOOD_PRESETS } from "@/constants/photography";
import type { UploadedImage } from "@/types/app";
import Image from "next/image";

interface StyleSelectorViewProps {
  uploadedImage: UploadedImage;
  initialFood?: string;
  isDetecting?: boolean;
  onConfirm: (food: string, style: string, format: string) => void;
  onBack: () => void;
}

const visualStyles = [
  {
    id: "ifood",
    label: "iFood / Delivery",
    desc: "Foco no prato, conversão direta.",
    icon: ShoppingBag,
  },
  {
    id: "capa",
    label: "Capa iFood",
    desc: "Banner de destaque widescreen.",
    icon: Layout,
  },
  {
    id: "stories",
    label: "Stories / Reels",
    desc: "Vertical impactante. Food porn.",
    icon: Smartphone,
  },
  {
    id: "promocao",
    label: "Promoção",
    desc: "Alto impacto para combos.",
    icon: Megaphone,
  },
  {
    id: "feed",
    label: "Feed / Post",
    desc: "Editorial premium pro Instagram.",
    icon: ImageIcon,
  },
  {
    id: "cardapio",
    label: "Cardápio",
    desc: "Foto limpa para impressão.",
    icon: BookOpen,
  },
];

const photographicStyles = [
  {
    id: "rustico",
    label: "Rústico",
    desc: "Madeira, luz quente e clima caseiro.",
  },
  {
    id: "clean",
    label: "Clean",
    desc: "Mármore branco, iluminação clara e moderna.",
  },
  {
    id: "premium-escuro",
    label: "Premium Escuro",
    desc: "Ardósia preta, luz dramática lateral.",
  },
  {
    id: "gourmet",
    label: "Gourmet Editorial",
    desc: "Bancada sofisticada, softbox natural.",
  },
];

const aspectRatios = [
  { id: "1:1", label: "Quadrado", desc: "iFood • Feed", icon: Square },
  { id: "9:16", label: "Vertical", desc: "Stories • Reels", icon: Smartphone },
  { id: "16:9", label: "Widescreen", desc: "Capa • Banner", icon: Monitor },
  { id: "4:3", label: "Paisagem", desc: "Cardápio Físico", icon: Layout },
];

export function StyleSelectorView({
  uploadedImage,
  initialFood,
  isDetecting = false,
  onConfirm,
  onBack,
}: StyleSelectorViewProps) {
  const [selectedFood, setSelectedFood] = useState<string | null>(initialFood || "hamburger");
  const [selectedObjective, setSelectedObjective] = useState<string>("ifood");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("rustico");
  const [selectedFormat, setSelectedFormat] = useState<string>("1:1");

  // Sync with AI classification
  useEffect(() => {
    if (initialFood) {
      setSelectedFood(initialFood);
    }
  }, [initialFood]);

  const handleObjectiveChange = (id: string) => {
    setSelectedObjective(id);
    if (id === "stories") setSelectedFormat("9:16");
    if (id === "capa") setSelectedFormat("16:9");
    if (id === "ifood" || id === "feed") setSelectedFormat("1:1");
    if (id === "cardapio") setSelectedFormat("4:3");
  };

  const foodData = useMemo(() => {
    return FOOD_PRESETS.find(p => p.id === selectedFood) || FOOD_PRESETS[0];
  }, [selectedFood]);

  const canGenerate = selectedFood && selectedEnvironment;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col px-[var(--space-page)] py-8 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            <Sparkles size={12} className="text-pepper-orange" />
            Motor Fotográfico AI Ativado
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
          {/* Left: Preview & Recipe */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={uploadedImage.preview}
                alt="Original"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
                <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-bold text-white/70 uppercase tracking-wider">
                  Foto Original
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/90">Detectado:</span>
                  <span className="text-xs font-bold text-pepper-orange bg-pepper-orange/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {isDetecting ? "Identificando..." : foodData.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="bg-bg-surface/50 rounded-2xl p-6 border border-border-subtle/50">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">
                Receita Fotográfica
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-pepper-orange">
                    <Camera size={14} />
                  </div>
                  <span className="text-xs text-text-secondary">{foodData.preset.cameraName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-pepper-orange">
                    <Sparkles size={14} />
                  </div>
                  <span className="text-xs text-text-secondary">{foodData.preset.lightingName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-pepper-orange">
                    <Maximize2 size={14} />
                  </div>
                  <span className="text-xs text-text-secondary">Formato: {selectedFormat}</span>
                </div>
              </div>
              <p className="mt-5 text-[10px] text-text-muted leading-relaxed">
                12 camadas profissionais serão aplicadas automaticamente.
              </p>
            </div>
            
            {/* CTA - Moved to bottom of left column for better flow on desktop */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canGenerate || isDetecting}
                onClick={() => onConfirm(selectedFood!, selectedEnvironment!, selectedFormat)}
                className={`
                  w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                  font-display font-bold text-base transition-all duration-300
                  ${canGenerate && !isDetecting
                    ? "bg-pepper-red text-white shadow-xl shadow-pepper-red/20 hover:bg-red-600"
                    : "bg-bg-surface text-text-muted cursor-not-allowed border border-border-subtle"
                  }
                `}
              >
                {isDetecting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Preparando...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Gerar Fotografia
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Right: Objectives, Environment, & Format */}
          <div className="flex flex-col gap-8 bg-bg-surface/30 p-8 rounded-[2rem] border border-border-subtle/30">
            
            {/* 1. Objetivos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-pepper-orange/20 text-pepper-orange flex items-center justify-center text-xs font-bold">1</div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Para que vai usar essa foto?
                </h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {visualStyles.map((style) => {
                  const Icon = style.icon;
                  const isSelected = selectedObjective === style.id;
                  return (
                    <motion.button
                      key={style.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleObjectiveChange(style.id)}
                      className={`
                        relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all duration-300
                        ${isSelected 
                          ? "bg-white ring-2 ring-pepper-red shadow-lg" 
                          : "bg-bg-surface hover:bg-bg-elevated border border-border-subtle"
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${isSelected ? "bg-pepper-red/10 text-pepper-red" : "bg-bg-elevated text-text-muted"}
                      `}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm mb-1 ${isSelected ? "text-slate-900" : "text-text-primary"}`}>
                          {style.label}
                        </h4>
                        <p className={`text-[10px] leading-relaxed ${isSelected ? "text-slate-500" : "text-text-muted"}`}>
                          {style.desc}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Ambiente/Estilo */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-pepper-orange/20 text-pepper-orange flex items-center justify-center text-xs font-bold">2</div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Ambiente / Estilo
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {photographicStyles.map((env) => {
                  const isSelected = selectedEnvironment === env.id;
                  return (
                    <motion.button
                      key={env.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEnvironment(env.id)}
                      className={`
                        relative flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300
                        ${isSelected 
                          ? "bg-slate-900 ring-2 ring-slate-900 shadow-lg text-white" 
                          : "bg-bg-surface hover:bg-bg-elevated border border-border-subtle"
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                        ${isSelected ? "bg-white/10 text-white" : "bg-bg-elevated text-text-muted"}
                      `}>
                        <Sun size={20} />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm mb-1 ${isSelected ? "text-white" : "text-text-primary"}`}>
                          {env.label}
                        </h4>
                        <p className={`text-[10px] leading-relaxed ${isSelected ? "text-white/70" : "text-text-muted"}`}>
                          {env.desc}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 3. Formato */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-pepper-orange/20 text-pepper-orange flex items-center justify-center text-xs font-bold">3</div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Formato da Imagem
                </h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {aspectRatios.map((ratio) => {
                  const Icon = ratio.icon;
                  const isSelected = selectedFormat === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedFormat(ratio.id)}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300
                        ${isSelected 
                          ? "bg-pepper-red text-white shadow-lg ring-2 ring-pepper-red" 
                          : "bg-bg-surface hover:bg-bg-elevated text-text-muted border border-border-subtle"
                        }
                      `}
                    >
                      <Icon size={18} className={isSelected ? "text-white" : "text-text-muted"} />
                      <div className="text-center">
                        <p className="text-[11px] font-bold">{ratio.label}</p>
                        <p className="text-[9px] opacity-70 mt-0.5">{ratio.id}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

