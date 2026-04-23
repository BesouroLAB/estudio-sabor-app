"use client";

import { useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ImagePlus, Sparkles, Camera } from "lucide-react";
import type { UploadedImage } from "@/types/app";

interface UploadViewProps {
  onImageUpload: (image: UploadedImage) => void;
}

export function UploadView({ onImageUpload }: UploadViewProps) {
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
      className="flex-1 flex flex-col items-center justify-center px-[var(--space-page)] py-12 overflow-y-auto"
    >
      {/* Hero Copy */}
      <div className="text-center mb-10 max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-pepper-orange text-xs font-bold tracking-wider uppercase mb-6"
        >
          <Sparkles size={14} />
          Marketing 1-Click para Delivery
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight leading-[1.1] mb-4"
        >
          Envie a foto do seu prato{" "}
          <span className="text-gradient-pepper">e veja a mágica</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-text-secondary text-base sm:text-lg leading-relaxed"
        >
          Transforme fotos de celular em imagens profissionais, capas para iFood
          e textos que vendem — tudo em 30 segundos.
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
                ? "border-pepper-red bg-pepper-red/5 scale-[1.02]"
                : "border-white/10 hover:border-white/20 bg-bg-surface"
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
                  ? "bg-pepper-red/20 text-pepper-red scale-110"
                  : "bg-white/5 text-text-muted group-hover:bg-white/8 group-hover:text-pepper-orange"
              }
            `}
          >
            {isDragging ? (
              <Upload size={36} className="animate-bounce-subtle" />
            ) : (
              <ImagePlus size={36} />
            )}
          </div>

          <p className="text-text-primary font-display font-bold text-lg mb-2">
            {isDragging ? "Solte a foto aqui!" : "Arraste a foto do prato"}
          </p>
          <p className="text-text-muted text-sm mb-6">
            ou clique para selecionar do celular
          </p>

          {/* CTA Button */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pepper-red to-pepper-orange text-white font-bold text-sm shadow-lg shadow-pepper-red/20 transition-transform group-hover:scale-105 active:scale-95">
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
        <div className="flex items-center justify-center gap-6 mt-6 text-text-muted text-xs">
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
    </motion.div>
  );
}
