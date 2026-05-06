"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  MessageCircle,
  ArrowRight
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
  const [currentStep, setCurrentStep] = useState<number>(0);
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
    setCurrentStep(1); // Auto-advance to next step
  };

  const foodData = useMemo(() => {
    return FOOD_PRESETS.find(p => p.id === selectedFood) || FOOD_PRESETS[0];
  }, [selectedFood]);

  const canGenerate = selectedEnvironment || keepBackground;

  const steps = [
    { id: "destino", label: "Destino" },
    { id: "personalizacao", label: "Ajustes" },
    { id: "estilo", label: "Ambiente" },
    { id: "formato", label: "Formato" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && keepBackground) {
      setCurrentStep(3); // Skip environment if keeping background
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 3 && keepBackground) {
      setCurrentStep(1);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col overflow-hidden bg-white"
    >
      <div className="flex-1 flex flex-col px-[var(--space-page)] py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={currentStep === 0 ? onBack : handlePrev}
              className="flex items-center gap-1.5 text-[#717171] hover:text-[#3E3E3E] text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              {currentStep === 0 ? "Voltar" : "Passo anterior"}
            </button>
            
            <div className="flex items-center gap-4">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      idx === currentStep ? "bg-[#EA1D2C] text-white shadow-md shadow-red-100" : 
                      idx < currentStep ? "bg-green-500 text-white" : "bg-[#F7F7F7] text-[#717171]"
                    }`}>
                      {idx < currentStep ? "✓" : idx + 1}
                    </div>
                    <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-wider ${idx === currentStep ? "text-[#3E3E3E]" : "text-[#717171]"}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-4 md:w-8 h-px bg-[#EAEAEC] mx-2" />
                  )}
                </div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold text-[#EA1D2C] uppercase tracking-widest">
              <Sparkles size={12} />
              Motor AI Ativo
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
            {/* Left Column: Fixed Preview & Recipe Tags */}
            <div className="flex flex-col gap-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl border border-[#EAEAEC]">
                <Image
                  src={uploadedImage.preview}
                  alt="Original"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                   <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                    Foto Original
                  </span>
                </div>
              </div>

              <div className="bg-[#F7F7F7] rounded-3xl p-6 border border-[#EAEAEC] shadow-sm">
                <h3 className="text-[9px] font-bold text-[#A6A6A6] uppercase tracking-[0.2em] mb-5">
                  Análise da Inteligência
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#EA1D2C]">
                      <Camera size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#A6A6A6] font-bold uppercase">Setup Sugerido</span>
                      <span className="text-xs font-bold text-[#3E3E3E]">{foodData.preset.cameraName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#EA1D2C]">
                      <Sparkles size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#A6A6A6] font-bold uppercase">Iluminação</span>
                      <span className="text-xs font-bold text-[#3E3E3E]">{foodData.preset.lightingName}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-2xl bg-white/60 border border-white/40">
                  <p className="text-[11px] text-[#717171] leading-relaxed font-medium">
                    Prato detectado como <span className="text-[#EA1D2C] font-bold">{isDetecting ? "..." : foodData.name}</span>. 
                    Nossos algoritmos selecionaram o melhor preset para realçar o brilho e textura desse item.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Wizard Steps */}
            <div className="flex flex-col bg-[#F7F7F7] rounded-[2.5rem] border border-[#EAEAEC] overflow-hidden shadow-inner">
              <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 tracking-tight">Onde essa foto será usada?</h2>
                        <p className="text-[#717171] text-sm">Escolha o destino para que a IA ajuste a composição e o formato ideal.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visualStyles.map((style) => {
                          const Icon = style.icon;
                          const isSelected = selectedObjective === style.id;
                          return (
                            <motion.button
                              key={style.id}
                              whileHover={{ y: -4, shadow: "0 10px 20px -5px rgba(0,0,0,0.05)" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleObjectiveChange(style.id, style.format)}
                              className={`
                                relative flex flex-col items-start gap-4 p-6 rounded-[28px] text-left transition-all duration-300
                                ${isSelected 
                                  ? "bg-white ring-2 ring-[#EA1D2C] shadow-xl" 
                                  : "bg-white/60 hover:bg-white border border-[#EAEAEC]"
                                }
                              `}
                            >
                              <div className={`
                                w-11 h-11 rounded-2xl flex items-center justify-center
                                ${isSelected ? "bg-[#EA1D2C] text-white" : "bg-[#F7F7F7] text-[#717171]"}
                              `}>
                                <Icon size={22} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#3E3E3E] mb-1">{style.label}</h4>
                                <p className="text-[10px] leading-relaxed text-[#717171] line-clamp-2">{style.desc}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-5 right-5">
                                  <div className="w-6 h-6 rounded-full bg-[#EA1D2C] flex items-center justify-center">
                                    <Sparkles size={12} className="text-white" />
                                  </div>
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-10"
                    >
                      <div className="max-w-xl">
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 tracking-tight">Personalização</h2>
                        <p className="text-[#717171] text-sm">Como você quer que a IA processe sua foto original?</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Ângulo */}
                        <div className="space-y-4">
                          <h3 className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-[0.2em]">Ângulo da Câmera</h3>
                          <div className="flex flex-col gap-3">
                            <button 
                              onClick={() => setKeepAngle(true)}
                              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${keepAngle ? "bg-white border-[#3E3E3E] shadow-md ring-1 ring-[#3E3E3E]" : "bg-white/60 border-[#EAEAEC] hover:bg-white"}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${keepAngle ? "bg-[#3E3E3E] text-white" : "bg-[#F7F7F7] text-[#717171]"}`}>
                                <Camera size={18} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-[#3E3E3E]">Manter Original</p>
                                <p className="text-[10px] text-[#717171]">Preserva o clique original</p>
                              </div>
                            </button>
                            <button 
                              onClick={() => setKeepAngle(false)}
                              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${!keepAngle ? "bg-white border-[#EA1D2C] shadow-md ring-1 ring-[#EA1D2C]" : "bg-white/60 border-[#EAEAEC] hover:bg-white"}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!keepAngle ? "bg-[#EA1D2C] text-white" : "bg-[#F7F7F7] text-[#717171]"}`}>
                                <Sparkles size={18} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-[#3E3E3E]">Otimizar IA</p>
                                <p className="text-[10px] text-[#717171]">Deixa a IA ajustar o ângulo</p>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Fundo */}
                        <div className="space-y-4">
                          <h3 className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-[0.2em]">Cenário / Background</h3>
                          <div className="flex flex-col gap-3">
                            <button 
                              onClick={() => setKeepBackground(true)}
                              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${keepBackground ? "bg-white border-[#3E3E3E] shadow-md ring-1 ring-[#3E3E3E]" : "bg-white/60 border-[#EAEAEC] hover:bg-white"}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${keepBackground ? "bg-[#3E3E3E] text-white" : "bg-[#F7F7F7] text-[#717171]"}`}>
                                <ImageIcon size={18} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-[#3E3E3E]">Manter Fundo</p>
                                <p className="text-[10px] text-[#717171]">Apenas limpeza e cor</p>
                              </div>
                            </button>
                            <button 
                              onClick={() => setKeepBackground(false)}
                              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${!keepBackground ? "bg-white border-[#EA1D2C] shadow-md ring-1 ring-[#EA1D2C]" : "bg-white/60 border-[#EAEAEC] hover:bg-white"}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!keepBackground ? "bg-[#EA1D2C] text-white" : "bg-[#F7F7F7] text-[#717171]"}`}>
                                <Layout size={18} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-[#3E3E3E]">Novo Cenário</p>
                                <p className="text-[10px] text-[#717171]">IA cria um ambiente premium</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && !keepBackground && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-8"
                    >
                      <div className="max-w-xl">
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 tracking-tight">Novo Ambiente</h2>
                        <p className="text-[#717171] text-sm">Qual clima você quer transmitir nesta nova foto?</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {photographicStyles.map((env) => {
                          const isSelected = selectedEnvironment === env.id;
                          return (
                            <button
                              key={env.id}
                              onClick={() => setSelectedEnvironment(env.id)}
                              className={`
                                flex items-center gap-5 p-5 rounded-[28px] text-left transition-all duration-300
                                ${isSelected 
                                  ? "bg-white ring-2 ring-[#EA1D2C] shadow-xl" 
                                  : "bg-white/60 hover:bg-white border border-[#EAEAEC]"
                                }
                              `}
                            >
                              <div className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                                ${isSelected ? "bg-[#EA1D2C] text-white" : "bg-[#F7F7F7] text-[#717171]"}
                              `}>
                                <Sun size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#3E3E3E] mb-1">{env.label}</h4>
                                <p className="text-[10px] leading-relaxed text-[#717171]">{env.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-10"
                    >
                      <div className="max-w-xl">
                        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 tracking-tight">Confirmar Formato</h2>
                        <p className="text-[#717171] text-sm">Ajuste final da proporção da imagem gerada.</p>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {aspectRatios.map((ratio) => {
                            const Icon = ratio.icon;
                            const isSelected = selectedFormat === ratio.id;
                            const isRecommended = selectedFormat === ratio.id; // Usually the first selected
                            return (
                              <button
                                key={ratio.id}
                                onClick={() => setSelectedFormat(ratio.id)}
                                className={`
                                  relative flex flex-col items-center justify-center gap-4 p-6 rounded-3xl transition-all border
                                  ${isSelected 
                                    ? "bg-white border-[#EA1D2C] ring-2 ring-[#EA1D2C] shadow-lg scale-[1.02]" 
                                    : "bg-white/60 text-[#717171] hover:bg-white border-[#EAEAEC]"
                                  }
                                `}
                              >
                                <Icon size={24} className={isSelected ? "text-[#EA1D2C]" : "text-[#717171]"} />
                                <div className="text-center">
                                  <span className={`block text-xs font-bold ${isSelected ? "text-[#3E3E3E]" : "text-[#717171]"}`}>{ratio.id}</span>
                                  <span className="text-[9px] uppercase font-bold tracking-widest">{ratio.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Settings Summary */}
                        <div className="p-6 rounded-3xl bg-white border border-[#EAEAEC] shadow-sm">
                          <h3 className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-widest mb-4">Resumo da Geração</h3>
                          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-[#717171] uppercase">Objetivo</span>
                              <span className="text-xs font-bold text-[#3E3E3E]">{visualStyles.find(s => s.id === selectedObjective)?.label}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-[#717171] uppercase">Ambiente</span>
                              <span className="text-xs font-bold text-[#3E3E3E]">{keepBackground ? "Original" : photographicStyles.find(s => s.id === selectedEnvironment)?.label}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-[#717171] uppercase">Proporção</span>
                              <span className="text-xs font-bold text-[#3E3E3E]">{selectedFormat}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-[#717171] uppercase">Custo</span>
                              <span className="text-xs font-bold text-[#EA1D2C]">1 Crédito</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky Action Footer */}
              <div className="p-8 lg:px-12 bg-white border-t border-[#EAEAEC] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_-15px_50px_rgba(0,0,0,0.04)]">
                <button
                  onClick={currentStep === 0 ? onBack : handlePrev}
                  className="order-2 sm:order-1 px-8 py-3 text-sm font-bold text-[#717171] hover:text-[#3E3E3E] transition-all"
                >
                  {currentStep === 0 ? "Cancelar" : "Voltar"}
                </button>

                <div className="order-1 sm:order-2 flex-1 flex justify-center">
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-12 py-4 rounded-2xl bg-[#3E3E3E] text-white font-bold text-sm shadow-xl hover:bg-black transition-all active:scale-95"
                    >
                      Próximo Passo
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02, shadow: "0 20px 40px -10px rgba(234,29,44,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!canGenerate || isDetecting}
                      onClick={() => onConfirm(selectedFood || "food", selectedEnvironment, selectedFormat, { keepAngle, keepBackground })}
                      className={`
                        w-full sm:w-auto flex items-center justify-center gap-3 px-16 py-5 rounded-2xl
                        font-bold text-lg transition-all duration-300 shadow-2xl
                        ${canGenerate && !isDetecting
                          ? "bg-[#EA1D2C] text-white hover:bg-[#D01925]"
                          : "bg-[#F7F7F7] text-[#717171] cursor-not-allowed border border-[#EAEAEC]"
                        }
                      `}
                    >
                      {isDetecting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Calibrando IA...
                        </>
                      ) : (
                        <>
                          <Wand2 size={22} />
                          Gerar Foto Profissional
                        </>
                      )}
                    </motion.button>
                  )}
                </div>

                <div className="hidden sm:block order-3 w-[100px]" /> {/* Spacer for centering */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
