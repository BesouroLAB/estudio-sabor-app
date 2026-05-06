"use client";

import { useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ImagePlus, Sparkles, Camera, ArrowLeft } from "lucide-react";
import type { UploadedImage } from "@/types/app";

interface UploadViewProps {
  onImageUpload: (image: UploadedImage) => void;
  onBack: () => void;
}

export function UploadView({ onImageUpload, onBack }: UploadViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        onImageUpload({
          file,
          preview: dataUrl,
          base64,
        });
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col px-6 py-12 overflow-y-auto bg-brand-dark relative select-none"
    >
      {/* Brand Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col relative z-10">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 text-white/40 hover:text-white transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar ao estúdio</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Hero Copy */}
          <div className="text-center mb-16 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white/60 text-[10px] font-black tracking-[0.2em] uppercase mb-8"
            >
              <Sparkles size={16} className="text-brand-yellow animate-pulse" />
              Inteligência Artificial para Performance Food
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-white font-display"
            >
              Transforme fotos comuns em{" "}
              <span className="text-transparent bg-clip-text bg-brand-gradient">Cenários de Estúdio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/40 text-lg font-medium leading-relaxed"
            >
              Nossa IA analisa seu prato, remove o fundo original e reconstrói reflexos e iluminação em um ambiente premium de alta conversão.
            </motion.p>
          </div>

          {/* Dropzone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl group/drop"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer 
                rounded-[48px] border-2 border-dashed
                transition-all duration-500
                flex flex-col items-center justify-center
                py-20 px-10 overflow-hidden
                ${
                  isDragging
                    ? "border-brand-orange bg-brand-orange/5 scale-[1.02]"
                    : "border-white/10 hover:border-brand-orange/30 bg-brand-surface shadow-2xl"
                }
              `}
              role="button"
              tabIndex={0}
              aria-label="Enviar foto do prato"
              id="upload-dropzone"
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover/drop:opacity-[0.03] transition-opacity duration-700" />

              {/* Animated icon */}
              <div
                className={`
                  w-24 h-24 rounded-3xl flex items-center justify-center mb-8
                  transition-all duration-700 relative z-10
                  ${
                    isDragging
                      ? "bg-brand-gradient text-white scale-110 shadow-2xl"
                      : "bg-brand-dark border border-white/5 text-white/20 group-hover/drop:scale-110 group-hover/drop:text-brand-orange group-hover/drop:border-brand-orange/20 shadow-inner"
                  }
                `}
              >
                {isDragging ? (
                  <Upload size={40} className="animate-bounce" />
                ) : (
                  <ImagePlus size={40} />
                )}
              </div>

              <div className="relative z-10 text-center">
                <p className="text-white font-black text-2xl mb-3 tracking-tight font-display">
                  {isDragging ? "Solte a foto agora!" : "Arraste a foto do seu prato"}
                </p>
                <p className="text-white/30 text-sm font-bold uppercase tracking-widest mb-10">
                  ou clique para selecionar
                </p>

                {/* CTA Button */}
                <div className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-brand-gradient text-white font-black text-sm shadow-[0_20px_40px_rgba(234,29,44,0.2)] transition-all hover:scale-105 hover:shadow-[0_25px_50px_rgba(234,29,44,0.3)] active:scale-95 uppercase tracking-widest">
                  <Camera size={20} />
                  Selecionar Foto
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload-input"
                aria-label="Selecionar arquivo de imagem"
              />
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              {[
                "JPG, PNG, WEBP",
                "Até 10MB",
                "Processamento Seguro"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,164,0,0.5)]" />
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
