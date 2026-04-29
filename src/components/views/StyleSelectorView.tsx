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
  Maximize2,
  Square,
  Sun,
  MessageCircle
} from "lucide-react";
import { FOOD_PRESETS } from "@/constants/photography";
import type { UploadedImage } from "@/types/app";
import Image from "next/image";

interface StyleSelectorViewProps {
  uploadedImage: UploadedImage;
  initialFood?: string;
  isDetecting?: boolean;
  onConfirm: (food: string, style: string, format: string, options: { keepAngle: boolean; keepBackground: boolean }) => void;
  onBack: () => void;
}

const visualStyles = [
  {
    id: "ifood",
    label: "iFood / Delivery",
    desc: "Foco no prato, conversão direta.",
    icon: ShoppingBag,
    format: "1:1"
  },
  {
    id: "capa",
    label: "Capa iFood",
    desc: "Banner de destaque widescreen.",
    icon: Layout,
    format: "16:9"
  },
  {
    id: "stories",
    label: "Stories / Reels",
    desc: "Vertical impactante. Food porn.",
    icon: Smartphone,
    format: "9:16"
  },
  {
    id: "promocao",
    label: "Promoções",
    desc: "Alto impacto para combos.",
    icon: Megaphone,
    format: "1:1"
  },
  {
    id: "whatsapp",
    label: "Promoção no WhatsApp",
    desc: "Formato quadrado perfeito para disparo.",
    icon: MessageCircle,
    format: "1:1"
  },
  {
    id: "feed",
    label: "Feed / Post",
    desc: "Editorial premium pro Instagram.",
    icon: ImageIcon,
    format: "1:1"
  },
  {
    id: "cardapio",
    label: "Cardápio Físico",
    desc: "Foto limpa para impressão.",
    icon: BookOpen,
    format: "4:3"
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
  { id: "1:1", label: "Quadrado", icon: Square },
  { id: "9:16", label: "Vertical", icon: Smartphone },
  { id: "16:9", label: "Widescreen", icon: Layout },
  { id: "4:3", label: "Paisagem", icon: Layout },
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
  const [keepAngle, setKeepAngle] = useState<boolean>(false);
  const [keepBackground, setKeepBackground] = useState<boolean>(false);

  // Sync with AI classification
  useEffect(() => {
    if (initialFood) {
      setSelectedFood(initialFood);
    }
  }, [initialFood]);

  const handleObjectiveChange = (id: string, format: string) => {
    setSelectedObjective(id);
    setSelectedFormat(format);
  };

  const foodData = useMemo(() => {
    return FOOD_PRESETS.find(p => p.id === selectedFood) || FOOD_PRESETS[0];
  }, [selectedFood]);

  const canGenerate = selectedEnvironment;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col px-[var(--space-page)] py-8 overflow-y-auto bg-white"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#717171] hover:text-[#3E3E3E] text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold text-[#EA1D2C] uppercase tracking-widest">
            <Sparkles size={12} />
            Motor Fotográfico AI
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
          {/* Left: Preview & Recipe */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-sm border border-[#EAEAEC]">
              <Image
                src={uploadedImage.preview}
                alt="Original"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
                <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  Foto Original
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/90">Detectado:</span>
                  <span className="text-xs font-bold text-white bg-[#EA1D2C]/90 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {isDetecting ? "Identificando IA..." : foodData.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="bg-[#F7F7F7] rounded-2xl p-6 border border-[#EAEAEC]">
              <h3 className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-4">
                Receita Inteligente
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#EA1D2C]">
                    <Camera size={14} />
                  </div>
                  <span className="text-xs font-medium text-[#3E3E3E]">{foodData.preset.cameraName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#EA1D2C]">
                    <Sparkles size={14} />
                  </div>
                  <span className="text-xs font-medium text-[#3E3E3E]">{foodData.preset.lightingName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#EA1D2C]">
                    <Maximize2 size={14} />
                  </div>
                  <span className="text-xs font-medium text-[#3E3E3E]">Formato: {selectedFormat}</span>
                </div>
              </div>
              <p className="mt-5 text-[10px] text-[#717171] leading-relaxed font-medium">
                Presets aplicados automaticamente baseados na detecção do prato.
              </p>
            </div>
            
            {/* CTA */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canGenerate || isDetecting}
                onClick={() => onConfirm(selectedFood || "food", selectedEnvironment, selectedFormat, { keepAngle, keepBackground })}
                className={`
                  w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                  font-bold text-base transition-all duration-300 shadow-md
                  ${canGenerate && !isDetecting
                    ? "bg-[#EA1D2C] text-white hover:bg-[#D01925]"
                    : "bg-[#F7F7F7] text-[#717171] cursor-not-allowed border border-[#EAEAEC]"
                  }
                `}
              >
                {isDetecting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processando Imagem...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Gerar Imagem Profissional
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Right: Objectives & Environment */}
          <div className="flex flex-col gap-8 bg-[#F7F7F7] p-8 rounded-[2rem] border border-[#EAEAEC]">
            
            {/* 1. Objetivos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#EA1D2C]/10 text-[#EA1D2C] flex items-center justify-center text-xs font-bold">1</div>
                <h2 className="font-bold text-xl text-[#3E3E3E]">
                  Para onde vai essa foto?
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
                      onClick={() => handleObjectiveChange(style.id, style.format)}
                      className={`
                        relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all duration-300
                        ${isSelected 
                          ? "bg-white ring-2 ring-[#EA1D2C] shadow-sm" 
                          : "bg-white hover:bg-gray-50 border border-[#EAEAEC]"
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${isSelected ? "bg-[#EA1D2C]/10 text-[#EA1D2C]" : "bg-[#F7F7F7] text-[#717171]"}
                      `}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm mb-1 ${isSelected ? "text-[#3E3E3E]" : "text-[#3E3E3E]"}`}>
                          {style.label}
                        </h4>
                        <p className="text-[10px] leading-relaxed text-[#717171]">
                          {style.desc}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Customização de Estrutura */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#EA1D2C]/10 text-[#EA1D2C] flex items-center justify-center text-xs font-bold">2</div>
                <h2 className="font-bold text-xl text-[#3E3E3E]">
                  O que vamos mudar?
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Ângulo */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#717171] uppercase tracking-wider">Ângulo da Foto</h3>
                  <div className="flex bg-white p-1 rounded-xl border border-[#EAEAEC]">
                    <button 
                      onClick={() => setKeepAngle(true)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${keepAngle ? "bg-[#3E3E3E] text-white shadow-sm" : "text-[#717171] hover:text-[#3E3E3E]"}`}
                    >
                      Manter Original
                    </button>
                    <button 
                      onClick={() => setKeepAngle(false)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!keepAngle ? "bg-[#EA1D2C] text-white shadow-sm" : "text-[#717171] hover:text-[#EA1D2C]"}`}
                    >
                      Criar Novo Angle
                    </button>
                  </div>
                </div>

                {/* Fundo */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#717171] uppercase tracking-wider">Cenário / Fundo</h3>
                  <div className="flex bg-white p-1 rounded-xl border border-[#EAEAEC]">
                    <button 
                      onClick={() => setKeepBackground(true)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${keepBackground ? "bg-[#3E3E3E] text-white shadow-sm" : "text-[#717171] hover:text-[#3E3E3E]"}`}
                    >
                      Manter Fundo
                    </button>
                    <button 
                      onClick={() => setKeepBackground(false)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!keepBackground ? "bg-[#EA1D2C] text-white shadow-sm" : "text-[#717171] hover:text-[#EA1D2C]"}`}
                    >
                      Transformar IA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Ambiente/Estilo (Only if background is NOT kept) */}
            {!keepBackground && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#EA1D2C]/10 text-[#EA1D2C] flex items-center justify-center text-xs font-bold">3</div>
                  <h2 className="font-bold text-xl text-[#3E3E3E]">
                    Escolha o novo cenário
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
                            ? "bg-white ring-2 ring-[#EA1D2C] shadow-sm" 
                            : "bg-white hover:bg-gray-50 border border-[#EAEAEC]"
                          }
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                          ${isSelected ? "bg-[#EA1D2C] text-white shadow-md" : "bg-[#F7F7F7] text-[#717171]"}
                        `}>
                          <Sun size={20} />
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm mb-1 ${isSelected ? "text-[#3E3E3E]" : "text-[#3E3E3E]"}`}>
                            {env.label}
                          </h4>
                          <p className="text-[10px] leading-relaxed text-[#717171]">
                            {env.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 3. Formato da Imagem (Somente Leitura ou Ajuste Manual Opcional) */}
            <div className="pt-2 border-t border-[#EAEAEC]">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-sm text-[#3E3E3E]">Proporção Automática</h3>
                 <span className="text-xs font-medium text-[#717171]">Ajustável se necessário</span>
               </div>
              <div className="grid grid-cols-4 gap-2">
                {aspectRatios.map((ratio) => {
                  const Icon = ratio.icon;
                  const isSelected = selectedFormat === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedFormat(ratio.id)}
                      className={`
                        flex flex-col items-center justify-center gap-1.5 py-2 rounded-xl transition-all
                        ${isSelected 
                          ? "bg-[#EA1D2C] text-white font-bold" 
                          : "bg-white text-[#717171] hover:bg-gray-50 border border-[#EAEAEC]"
                        }
                      `}
                    >
                      <Icon size={14} className={isSelected ? "text-white" : "text-[#717171]"} />
                      <span className="text-[10px]">{ratio.id}</span>
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
