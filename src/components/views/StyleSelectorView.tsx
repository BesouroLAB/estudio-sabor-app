"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wand2,
  Pizza,
  Beef,
  Fish,
  Cake,
  Salad,
  Coffee,
  Sandwich,
  Soup,
  Sun,
  Moon,
  Leaf,
  Crown,
} from "lucide-react";
import type { UploadedImage } from "@/app/page";
import Image from "next/image";

interface StyleSelectorViewProps {
  uploadedImage: UploadedImage;
  onConfirm: (food: string, style: string) => void;
  onBack: () => void;
}

const foodTypes = [
  { id: "pizza", label: "Pizza", icon: Pizza, color: "from-red-500 to-orange-500" },
  { id: "hamburger", label: "Hambúrguer", icon: Beef, color: "from-amber-600 to-yellow-500" },
  { id: "sushi", label: "Sushi/Japonesa", icon: Fish, color: "from-rose-400 to-pink-500" },
  { id: "sobremesa", label: "Sobremesa", icon: Cake, color: "from-pink-400 to-purple-400" },
  { id: "salada", label: "Salada/Fit", icon: Salad, color: "from-green-500 to-emerald-400" },
  { id: "cafe", label: "Café/Bebida", icon: Coffee, color: "from-amber-700 to-amber-500" },
  { id: "lanche", label: "Lanche/Wrap", icon: Sandwich, color: "from-orange-500 to-yellow-500" },
  { id: "prato-feito", label: "Prato Feito", icon: Soup, color: "from-amber-500 to-red-500" },
];

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

export function StyleSelectorView({
  uploadedImage,
  onConfirm,
  onBack,
}: StyleSelectorViewProps) {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

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

            {/* Generate CTA */}
            <div className="mt-auto pt-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={!canGenerate}
                onClick={() => {
                  if (canGenerate) onConfirm(selectedFood!, selectedStyle!);
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
