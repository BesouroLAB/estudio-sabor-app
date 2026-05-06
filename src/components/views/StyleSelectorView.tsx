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
      className="flex-1 flex flex-col overflow-hidden bg-brand-dark select-none"
    >
      {/* Brand Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-12 gap-6 flex-wrap md:flex-nowrap">
            <button
              onClick={currentStep === 0 ? onBack : handlePrev}
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-all"
            >
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{currentStep === 0 ? "Voltar" : "Passo anterior"}</span>
            </button>
            
            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-center max-w-xl">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                      idx === currentStep ? "bg-brand-gradient text-white shadow-[0_0_20px_rgba(234,29,44,0.3)] scale-110" : 
                      idx < currentStep ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" : "bg-white/5 text-white/20 border border-white/5"
                    }`}>
                      {idx < currentStep ? "✓" : idx + 1}
                    </div>
                    <span className={`hidden md:inline text-[9px] font-black uppercase tracking-widest ${idx === currentStep ? "text-white" : "text-white/20"}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-4 rounded-full transition-colors duration-700 ${idx < currentStep ? "bg-brand-orange/40" : "bg-white/5"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="hidden xl:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] shadow-xl">
              <Sparkles size={14} className="animate-pulse" />
              IA Engine v4.0
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
            {/* Left Column: Fixed Preview & Recipe Tags */}
            <div className="flex flex-col gap-8">
              <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl border border-white/5 group">
                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-700 z-10" />
                <Image
                  src={uploadedImage.preview}
                  alt="Original"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Foto Carregada</span>
                </div>
              </div>

              <div className="bg-brand-surface rounded-[40px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/10 transition-colors" />
                
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <Wand2 size={14} className="text-brand-orange" /> Parâmetros Detectados
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-5 p-4 rounded-3xl bg-brand-dark/50 border border-white/5 shadow-inner">
                    <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-xl">
                      <Camera size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">Preset Sugerido</span>
                      <span className="text-sm font-bold text-white tracking-tight">{foodData.preset.cameraName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5 p-4 rounded-3xl bg-brand-dark/50 border border-white/5 shadow-inner">
                    <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-xl">
                      <Sun size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">Luz Dinâmica</span>
                      <span className="text-sm font-bold text-white tracking-tight">{foodData.preset.lightingName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-6 rounded-3xl bg-brand-dark/40 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-gradient" />
                  <p className="text-xs text-white/50 leading-relaxed font-medium italic">
                    "Identificamos <span className="text-brand-orange font-black uppercase tracking-widest ml-1">{isDetecting ? "processando..." : foodData.name}</span>. A rede neural aplicará calibração premium para texturas gastronômicas."
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Wizard Steps */}
            <div className="flex flex-col bg-brand-surface rounded-[48px] border border-white/5 overflow-hidden shadow-2xl relative group/wizard">
              <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover/wizard:opacity-[0.02] transition-opacity duration-1000 pointer-events-none" />
              
              <div className="flex-1 p-8 lg:p-16 overflow-y-auto relative z-10 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-12"
                    >
                      <div>
                        <div className="h-1.5 w-16 bg-brand-gradient rounded-full mb-8" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter font-display leading-[1.1]">Onde essa foto <br /><span className="text-transparent bg-clip-text bg-brand-gradient">será usada?</span></h2>
                        <p className="text-white/40 text-lg font-medium">Escolha o destino para que a IA ajuste a composição e iluminação ideal.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visualStyles.map((style) => {
                          const Icon = style.icon;
                          const isSelected = selectedObjective === style.id;
                          return (
                            <motion.button
                              key={style.id}
                              whileHover={{ scale: 1.02, y: -4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleObjectiveChange(style.id, style.format)}
                              className={`
                                relative flex flex-col items-start gap-6 p-8 rounded-[40px] text-left transition-all duration-500 group/card
                                ${isSelected 
                                  ? "bg-brand-dark ring-2 ring-brand-red shadow-[0_20px_40px_rgba(234,29,44,0.15)]" 
                                  : "bg-brand-dark/40 hover:bg-brand-dark/60 border border-white/5"
                                }
                              `}
                            >
                              <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                ${isSelected ? "bg-brand-gradient text-white shadow-xl" : "bg-brand-surface text-white/20 group-hover/card:text-brand-orange shadow-inner"}
                              `}>
                                <Icon size={24} />
                              </div>
                              <div>
                                <h4 className={`font-black text-sm uppercase tracking-widest mb-2 ${isSelected ? "text-white" : "text-white/60"}`}>{style.label}</h4>
                                <p className="text-[11px] leading-relaxed text-white/30 font-medium line-clamp-2">{style.desc}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-6 right-6">
                                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg">
                                    <Sparkles size={14} className="text-white" />
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-12"
                    >
                      <div className="max-w-xl">
                        <div className="h-1.5 w-16 bg-brand-gradient rounded-full mb-8" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter font-display leading-[1.1]">Personalize o <br /><span className="text-transparent bg-clip-text bg-brand-gradient">Comportamento</span></h2>
                        <p className="text-white/40 text-lg font-medium">Como você quer que a IA processe sua foto original?</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Ângulo */}
                        <div className="space-y-6">
                          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Ângulo da Câmera</h3>
                          <div className="flex flex-col gap-4">
                            {[
                              { id: true, label: "Manter Original", desc: "Preserva o clique original", icon: Camera },
                              { id: false, label: "Otimizar IA", desc: "IA calibra o melhor ângulo", icon: Sparkles }
                            ].map((opt) => {
                              const Icon = opt.icon;
                              const isSelected = keepAngle === opt.id;
                              return (
                                <button 
                                  key={String(opt.id)}
                                  onClick={() => setKeepAngle(opt.id)}
                                  className={`group flex items-center gap-6 p-6 rounded-[32px] border transition-all duration-500 ${isSelected ? "bg-brand-dark border-brand-red shadow-2xl ring-1 ring-brand-red/20" : "bg-brand-dark/30 border-white/5 hover:bg-brand-dark/50"}`}
                                >
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? "bg-brand-gradient text-white shadow-xl" : "bg-brand-surface text-white/20"}`}>
                                    <Icon size={24} />
                                  </div>
                                  <div className="text-left">
                                    <p className={`text-sm font-black uppercase tracking-widest mb-1 ${isSelected ? "text-white" : "text-white/40"}`}>{opt.label}</p>
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-tight">{opt.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Fundo */}
                        <div className="space-y-6">
                          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Cenário / Background</h3>
                          <div className="flex flex-col gap-4">
                            {[
                              { id: true, label: "Manter Fundo", desc: "Apenas limpeza e cor", icon: ImageIcon },
                              { id: false, label: "Novo Cenário", desc: "IA cria ambiente premium", icon: Layout }
                            ].map((opt) => {
                              const Icon = opt.icon;
                              const isSelected = keepBackground === opt.id;
                              return (
                                <button 
                                  key={String(opt.id)}
                                  onClick={() => setKeepBackground(opt.id)}
                                  className={`group flex items-center gap-6 p-6 rounded-[32px] border transition-all duration-500 ${isSelected ? "bg-brand-dark border-brand-orange shadow-2xl ring-1 ring-brand-orange/20" : "bg-brand-dark/30 border-white/5 hover:bg-brand-dark/50"}`}
                                >
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? "bg-brand-gradient text-white shadow-xl" : "bg-brand-surface text-white/20"}`}>
                                    <Icon size={24} />
                                  </div>
                                  <div className="text-left">
                                    <p className={`text-sm font-black uppercase tracking-widest mb-1 ${isSelected ? "text-white" : "text-white/40"}`}>{opt.label}</p>
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-tight">{opt.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && !keepBackground && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-12"
                    >
                      <div className="max-w-xl">
                        <div className="h-1.5 w-16 bg-brand-gradient rounded-full mb-8" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter font-display leading-[1.1]">Atmosfera do <br /><span className="text-transparent bg-clip-text bg-brand-gradient">Ambiente</span></h2>
                        <p className="text-white/40 text-lg font-medium">Qual clima você quer transmitir nesta nova foto?</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {photographicStyles.map((env) => {
                          const isSelected = selectedEnvironment === env.id;
                          return (
                            <button
                              key={env.id}
                              onClick={() => setSelectedEnvironment(env.id)}
                              className={`
                                flex items-center gap-6 p-8 rounded-[40px] text-left transition-all duration-500
                                ${isSelected 
                                  ? "bg-brand-dark ring-2 ring-brand-red shadow-2xl" 
                                  : "bg-brand-dark/40 hover:bg-brand-dark/60 border border-white/5"
                                }
                              `}
                            >
                              <div className={`
                                w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-xl
                                ${isSelected ? "bg-brand-gradient text-white" : "bg-brand-surface text-white/10"}
                              `}>
                                <Sun size={28} />
                              </div>
                              <div>
                                <h4 className={`font-black text-base uppercase tracking-widest mb-2 ${isSelected ? "text-white" : "text-white/40"}`}>{env.label}</h4>
                                <p className="text-[11px] leading-relaxed text-white/20 font-medium">{env.desc}</p>
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-12"
                    >
                      <div className="max-w-xl">
                        <div className="h-1.5 w-16 bg-brand-gradient rounded-full mb-8" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter font-display leading-[1.1]">Dimensões e <br /><span className="text-transparent bg-clip-text bg-brand-gradient">Proporção</span></h2>
                        <p className="text-white/40 text-lg font-medium">Ajuste final da proporção da imagem gerada.</p>
                      </div>

                      <div className="space-y-12">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                          {aspectRatios.map((ratio) => {
                            const Icon = ratio.icon;
                            const isSelected = selectedFormat === ratio.id;
                            return (
                              <button
                                key={ratio.id}
                                onClick={() => setSelectedFormat(ratio.id)}
                                className={`
                                  relative flex flex-col items-center justify-center gap-5 p-8 rounded-[32px] transition-all duration-500 border
                                  ${isSelected 
                                    ? "bg-brand-dark border-brand-red ring-2 ring-brand-red shadow-2xl scale-105" 
                                    : "bg-brand-dark/40 text-white/20 hover:bg-brand-dark/60 border-white/5"
                                  }
                                `}
                              >
                                <Icon size={28} className={isSelected ? "text-brand-orange" : "text-white/10"} />
                                <div className="text-center">
                                  <span className={`block text-lg font-black tracking-tighter ${isSelected ? "text-white" : "text-white/20"}`}>{ratio.id}</span>
                                  <span className="text-[9px] uppercase font-black tracking-[0.2em]">{ratio.label}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Settings Summary */}
                        <div className="p-8 rounded-[40px] bg-brand-dark/60 border border-white/5 shadow-inner relative overflow-hidden group/sum">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl pointer-events-none" />
                          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Sparkles size={14} className="text-brand-orange" /> Resumo da Configuração
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                              { label: "Objetivo", value: visualStyles.find(s => s.id === selectedObjective)?.label },
                              { label: "Ambiente", value: keepBackground ? "Original" : photographicStyles.find(s => s.id === selectedEnvironment)?.label },
                              { label: "Formato", value: selectedFormat },
                              { label: "Custo IA", value: "1 Crédito", accent: true }
                            ].map((sum, i) => (
                              <div key={i} className="flex flex-col">
                                <span className="text-[9px] font-black text-white/10 uppercase tracking-widest mb-2">{sum.label}</span>
                                <span className={`text-sm font-black uppercase tracking-tight ${sum.accent ? "text-brand-orange" : "text-white"}`}>{sum.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky Action Footer */}
              <div className="p-8 lg:p-12 bg-brand-surface border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-20">
                <button
                  onClick={currentStep === 0 ? onBack : handlePrev}
                  className="order-2 sm:order-1 px-8 py-4 text-xs font-black text-white/30 hover:text-white uppercase tracking-widest transition-all"
                >
                  {currentStep === 0 ? "Cancelar" : "Voltar Etapa"}
                </button>

                <div className="order-1 sm:order-2 flex-1 flex justify-center w-full sm:w-auto">
                  {currentStep < 3 ? (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-white text-brand-dark font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-brand-orange hover:text-white transition-all group/next"
                    >
                      Próxima Etapa
                      <ArrowRight size={18} className="group-hover/next:translate-x-1 transition-transform" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!canGenerate || isDetecting}
                      onClick={() => onConfirm(selectedFood || "food", selectedEnvironment, selectedFormat, { keepAngle, keepBackground })}
                      className={`
                        w-full sm:w-auto flex items-center justify-center gap-4 px-20 py-6 rounded-[24px]
                        font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-[0_20px_50px_rgba(234,29,44,0.3)]
                        ${canGenerate && !isDetecting
                          ? "bg-brand-gradient text-white hover:shadow-[0_25px_60px_rgba(234,29,44,0.4)]"
                          : "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
                        }
                      `}
                    >
                      {isDetecting ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          Calibrando Motor IA...
                        </>
                      ) : (
                        <>
                          <Wand2 size={24} />
                          Iniciar Processamento
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
