"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wand2,
  Sun,
  Moon,
  Leaf,
  Crown,
} from "lucide-react";
import { FOOD_PRESETS } from "@/constants/photography";
import type { UploadedImage } from "@/types/app";
import Image from "next/image";

interface StyleSelectorViewProps {
  uploadedImage: UploadedImage;
  initialFood?: string;
  initialStyle?: string;
  onConfirm: (food: string, style: string, format: string) => void;
  onBack: () => void;
}


const foodTypes = FOOD_PRESETS.map(preset => ({
  id: preset.id,
  label: preset.name,
  icon: preset.icon,
  color: preset.color
}));

const visualStyles = [
  {
    id: "rustico",
    label: "Rústico & Aconchegante",
    desc: "Madeira, luz quente, caseiro",
    icon: Sun,
    preview: "bg-gradient-to-br from-amber-900/40 to-orange-900/30",
  },
  {
    id: "premium-escuro",
    label: "Premium Escuro",
    desc: "Fundo escuro, luxo, contraste",
    icon: Moon,
    preview: "bg-gradient-to-br from-zinc-900 to-black",
  },
  {
    id: "clean",
    label: "Claro & Clean",
    desc: "Minimalista, fundo claro, moderno",
    icon: Leaf,
    preview: "bg-gradient-to-br from-stone-100/10 to-white/5",
  },
  {
    id: "gourmet",
    label: "Gourmet Chef",
    desc: "Mármore, elegante, sofisticado",
    icon: Crown,
    preview: "bg-gradient-to-br from-stone-800/40 to-zinc-900/40",
  },
];

const aspectRatios = [
  { id: "1:1", label: "Quadrado (iFood)", desc: "Feed & Cardápio", icon: "aspect-square" },
  { id: "9:16", label: "Vertical (Stories)", desc: "Reels & Whats", icon: "aspect-video rotate-90" },
];

export function StyleSelectorView({
  uploadedImage,
  initialFood,
  initialStyle,
  onConfirm,
  onBack,
}: StyleSelectorViewProps) {
  // Helper to find initial match by ID or Label
  const findFoodId = (val?: string) => {
    if (!val) return null;
    const match = foodTypes.find(f => f.id === val || f.label.toLowerCase() === val.toLowerCase());
    return match ? match.id : null;
  };

  const findStyleId = (val?: string) => {
    if (!val) return null;
    const match = visualStyles.find(v => v.id === val || v.label.toLowerCase() === val.toLowerCase());
    return match ? match.id : null;
  };

  const [selectedFood, setSelectedFood] = useState<string | null>(findFoodId(initialFood));
  const [selectedStyle, setSelectedStyle] = useState<string | null>(findStyleId(initialStyle));
  const [selectedFormat, setSelectedFormat] = useState<string>("1:1"); // Default to 1:1

  const canGenerate = selectedFood && selectedStyle;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col px-[var(--space-page)] py-8"
    >
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-sm font-medium mb-6 transition-colors self-start focus-ring rounded-lg px-2 py-1"
          id="back-to-upload"
        >
          <ArrowLeft size={16} />
          Trocar foto
        </button>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Left: Preview */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-border-subtle">
              <Image
                src={uploadedImage.preview}
                alt="Foto enviada"
                fill
                className="object-cover"
                sizes="280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs font-bold text-white/80 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                Sua foto original
              </span>
            </div>
          </div>

          {/* Right: Selectors */}
          <div className="flex flex-col gap-8">
            {/* Food Type */}
            <div>
              <h2 className="font-display font-bold text-lg text-text-primary mb-1">
                Qual é o prato?
              </h2>
              <p className="text-text-muted text-sm mb-4">
                Isso ajuda a IA a acertar os detalhes de textura e cores
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {foodTypes.map((food) => {
                  const Icon = food.icon;
                  const isSelected = selectedFood === food.id;
                  return (
                    <motion.button
                      key={food.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFood(food.id)}
                      className={`
                        relative flex flex-col items-center gap-2 p-4 rounded-xl
                        border transition-all duration-200 cursor-pointer
                        focus-ring
                        ${
                          isSelected
                            ? "border-pepper-red/50 bg-pepper-red/8 shadow-lg shadow-pepper-red/10"
                            : "border-border-subtle bg-bg-surface hover:border-white/15 hover:bg-bg-elevated"
                        }
                      `}
                      id={`food-type-${food.id}`}
                    >
                      <div
                        className={`
                          w-10 h-10 rounded-xl flex items-center justify-center transition-all
                          ${
                            isSelected
                              ? `bg-gradient-to-br ${food.color} text-white shadow-md`
                              : "bg-white/5 text-text-muted"
                          }
                        `}
                      >
                        <Icon size={20} />
                      </div>
                      <span
                        className={`text-xs font-semibold tracking-wide ${
                          isSelected ? "text-text-primary" : "text-text-secondary"
                        }`}
                      >
                        {food.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          layoutId="food-check"
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pepper-red flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Visual Style */}
            <div>
              <h2 className="font-display font-bold text-lg text-text-primary mb-1">
                Qual o estilo visual?
              </h2>
              <p className="text-text-muted text-sm mb-4">
                Escolha a &quot;vibe&quot; que combina com sua marca
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visualStyles.map((style) => {
                  const Icon = style.icon;
                  const isSelected = selectedStyle === style.id;
                  return (
                    <motion.button
                      key={style.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`
                        relative flex items-center gap-4 p-4 rounded-xl
                        border transition-all duration-200 cursor-pointer text-left
                        focus-ring
                        ${
                          isSelected
                            ? "border-pepper-orange/50 bg-pepper-orange/8 shadow-lg shadow-pepper-orange/10"
                            : "border-border-subtle bg-bg-surface hover:border-white/15 hover:bg-bg-elevated"
                        }
                      `}
                      id={`visual-style-${style.id}`}
                    >
                      <div
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${style.preview} border border-white/5
                          ${isSelected ? "ring-2 ring-pepper-orange/30" : ""}
                        `}
                      >
                        <Icon
                          size={20}
                          className={
                            isSelected ? "text-pepper-orange" : "text-text-muted"
                          }
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`font-semibold text-sm ${
                            isSelected ? "text-text-primary" : "text-text-secondary"
                          }`}
                        >
                          {style.label}
                        </p>
                        <p className="text-text-muted text-xs mt-0.5">
                          {style.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          layoutId="style-check"
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pepper-orange flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-bg-elevated/30 p-4 rounded-2xl border border-white/5">
              <h2 className="font-display font-medium text-xs text-text-secondary mb-3 uppercase tracking-wider">
                Formato da Campanha
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedFormat(ratio.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border transition-all
                      ${selectedFormat === ratio.id 
                        ? "border-pepper-orange/30 bg-pepper-orange/5 text-pepper-orange shadow-sm" 
                        : "border-border-subtle hover:border-white/10 bg-bg-surface text-text-muted"}
                    `}
                  >
                    <div className={`border-2 border-current rounded-[2px] opacity-70 ${ratio.id === "9:16" ? "w-3 h-5" : "w-4 h-4"}`} />
                    <div className="text-left">
                      <p className="text-xs font-bold leading-none">{ratio.label.split(" (")[0]}</p>
                      <p className="text-[10px] mt-1 opacity-60 leading-none">{ratio.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate CTA */}
            <div className="mt-auto pt-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={!canGenerate}
                onClick={() => {
                  if (canGenerate) onConfirm(selectedFood!, selectedStyle!, selectedFormat);
                }}
                className={`
                  w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl
                  font-display font-bold text-lg tracking-tight
                  transition-all duration-300
                  focus-ring
                  ${
                    canGenerate
                      ? "bg-gradient-to-r from-pepper-red to-pepper-orange text-white shadow-xl shadow-pepper-red/25 hover:shadow-pepper-red/40 cursor-pointer active:scale-[0.98]"
                      : "bg-white/5 text-text-muted cursor-not-allowed"
                  }
                `}
                id="generate-package-btn"
              >
                <Wand2 size={22} />
                🪄 Gerar Pacote iFood
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
