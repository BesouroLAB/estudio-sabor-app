"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, RotateCcw } from "lucide-react";
import type { AppStep } from "@/app/page";

interface HeaderProps {
  onReset: () => void;
  currentStep: AppStep;
}

const stepLabels: Record<AppStep, string> = {
  upload: "Enviar Foto",
  style: "Escolher Estilo",
  loading: "Gerando...",
  result: "Seu Pacote",
};

export function Header({ onReset, currentStep }: HeaderProps) {
  const steps: AppStep[] = ["upload", "style", "loading", "result"];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-[var(--space-page)] h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 group focus-ring rounded-lg"
          aria-label="Voltar ao início"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pepper-red to-pepper-orange flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <Flame size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-text-primary hidden sm:block">
            Estúdio & Sabor
          </span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1.5">
                <motion.div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= currentIndex
                      ? "bg-gradient-to-r from-pepper-red to-pepper-orange w-6 sm:w-8"
                      : "bg-white/10 w-4 sm:w-6"
                  }`}
                  layout
                />
                <span
                  className={`text-[10px] font-medium tracking-wider uppercase hidden md:block transition-colors ${
                    i === currentIndex
                      ? "text-pepper-orange"
                      : i < currentIndex
                      ? "text-text-secondary"
                      : "text-text-muted"
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Reset */}
        {currentStep !== "upload" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReset}
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-xs font-medium transition-colors focus-ring rounded-lg px-2 py-1"
            aria-label="Recomeçar"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:block">Recomeçar</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}
