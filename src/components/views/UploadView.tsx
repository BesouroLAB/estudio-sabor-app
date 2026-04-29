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
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-4">
      {/* Hero Copy */}
      <div className="text-center mb-10 max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-[#EA1D2C] text-xs font-bold tracking-wider uppercase mb-6"
        >
          <Sparkles size={14} />
          Inteligência Artificial para Delivery
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4 text-[#3E3E3E]"
        >
          Transforme fotos comuns em{" "}
          <span className="text-[#EA1D2C]">imagens profissionais</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#717171] text-base sm:text-lg leading-relaxed"
        >
          Nossa IA remove fundos feios, ajusta reflexos e cria cenários premium. 
          Basta enviar a foto do prato e nós fazemos o resto.
        </motion.p>
      </div>

      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-lg"
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer group
            rounded-2xl border-2 border-dashed
            transition-all duration-300
            flex flex-col items-center justify-center
            py-16 px-8
            ${
              isDragging
                ? "border-[#EA1D2C] bg-red-50 scale-[1.02]"
                : "border-[#EAEAEC] hover:border-[#EA1D2C] bg-white"
            }
          `}
          role="button"
          tabIndex={0}
          aria-label="Enviar foto do prato"
          id="upload-dropzone"
        >
          {/* Animated icon */}
          <div
            className={`
              w-20 h-20 rounded-2xl flex items-center justify-center mb-6
              transition-all duration-500
              ${
                isDragging
                  ? "bg-red-100 text-[#EA1D2C] scale-110"
                  : "bg-[#F7F7F7] text-[#717171] group-hover:bg-red-50 group-hover:text-[#EA1D2C]"
              }
            `}
          >
            {isDragging ? (
              <Upload size={36} className="animate-bounce-subtle" />
            ) : (
              <ImagePlus size={36} />
            )}
          </div>

          <p className="text-[#3E3E3E] font-bold text-lg mb-2">
            {isDragging ? "Solte a foto aqui!" : "Arraste a foto do prato"}
          </p>
          <p className="text-[#717171] text-sm mb-6">
            ou clique para selecionar do celular
          </p>

          {/* CTA Button */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EA1D2C] hover:bg-[#D01925] text-white font-bold text-sm shadow-md transition-transform group-hover:scale-105 active:scale-95">
            <Camera size={16} />
            Escolher Foto
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
        <div className="flex items-center justify-center gap-6 mt-6 text-[#717171] text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            JPG, PNG, WEBP
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Até 10MB
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            100% privado
          </span>
        </div>
        </motion.div>
      </div>
    </div>
  </motion.div>
  );
}
