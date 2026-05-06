"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Loader2, Download, Check, Sparkles, UploadCloud, X, Zap, Copy, Layout, Smartphone, ImageIcon, Type } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { uploadImage, generateFullKit, classifyImage } from "@/services/api";

export default function KitCompletoGeneratorPage() {
  const router = useRouter();
  const { userCredits, setUserCredits } = useDashboard();
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [foodType, setFoodType] = useState("");
  const [style, setStyle] = useState("Moderno e Apetitoso");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; copyTexts: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setError(null);
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Por favor, envie a foto do seu prato primeiro.");
      return;
    }

    if (userCredits < 5) {
      setError("Créditos insuficientes. Você precisa de 5 ⚡ para gerar o Kit Completo.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Upload da imagem
      const uploadedPath = await uploadImage(file);
      
      // 2. Classificação
      let detectedFood = foodType;
      if (!detectedFood) {
        detectedFood = await classifyImage(uploadedPath, file.type);
        setFoodType(detectedFood);
      }

      // 3. Gerar Kit Completo (service = kit_completo)
      const referenceId = `kit_${Date.now()}`;
      const kitResult = await generateFullKit(
        uploadedPath,
        file.type,
        detectedFood,
        style,
        "1:1", // The API returns one high-res base image that we will crop/format
        "kit_completo",
        referenceId,
        { keepAngle: false, keepBackground: false }
      );

      // Atualiza créditos
      if (kitResult.remaining_credits !== undefined) {
        setUserCredits(kitResult.remaining_credits);
      } else {
        setUserCredits(userCredits - 5);
      }

      setResult({
        imageUrl: kitResult.imageUrl,
        copyTexts: kitResult.copyTexts
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar seu Kit. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format: 'square' | 'story' | 'banner', label: string) => {
    if (!result?.imageUrl) return;
    try {
      // In a real app with a canvas, we would crop it before downloading.
      // For now, we trigger the download of the master image.
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estudio-sabor-${label}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download falhou', error);
      window.open(result.imageUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark min-h-screen">
      {/* Brand Aura Glows */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-brand-red/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <button
          onClick={() => router.push('/estudio')}
          className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao painel</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient p-[1px] shadow-2xl shadow-brand-red/20">
              <div className="w-full h-full rounded-2xl bg-brand-dark flex items-center justify-center text-white">
                <Star size={32} className="text-brand-orange animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-display flex items-center gap-4">
                Kit Dominação <Sparkles size={28} className="text-brand-yellow" />
              </h1>
              <p className="text-white/60 font-medium max-w-xl mt-2 leading-relaxed">
                Transforme uma única foto em uma campanha completa. Posts, Stories, Capas e Copys magnéticas em segundos.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-brand-surface px-6 py-4 rounded-2xl border border-white/5 shadow-2xl">
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Saldo Atual:</span>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <span className="flex items-center gap-2 text-brand-yellow font-bold text-xl">
              <Zap size={20} className="fill-brand-yellow" /> {userCredits}
            </span>
          </div>
        </div>

        {!result ? (
          <div className="grid lg:grid-cols-[480px_1fr] gap-10 items-start">
            {/* Formulário */}
            <div className="bg-brand-surface rounded-[32px] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gradient opacity-5 blur-[80px]" />
              
              <form onSubmit={handleGenerate} className="flex flex-col gap-8 relative z-10">
                {/* Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-white/80 uppercase tracking-wider">Foto Mestra do Prato</label>
                  {!previewUrl ? (
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-white/40 hover:bg-white/[0.02] hover:border-brand-orange/50 transition-all cursor-pointer group/upload"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover/upload:scale-110 group-hover/upload:text-brand-orange transition-all border border-white/5 shadow-xl">
                        <UploadCloud size={32} />
                      </div>
                      <span className="text-lg font-bold text-white mb-2 text-center">Clique ou arraste sua foto</span>
                      <p className="text-sm text-white/30 text-center max-w-xs leading-relaxed">
                        Nossa IA cuidará do fundo, iluminação e formatos para você.
                      </p>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-brand-dark group/preview">
                      <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => { setFile(null); setPreviewUrl(null); }}
                          className="bg-brand-red text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-2xl"
                        >
                          <X size={18} /> Substituir Foto
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-8">
                  {/* Nome do Prato */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-white/80 uppercase tracking-wider">Nome do Prato</label>
                    <input
                      type="text"
                      placeholder="Ex: Combo Smash Cheddar + Fritas"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all font-medium"
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value)}
                    />
                  </div>

                  {/* Estilo Visual */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-white/80 uppercase tracking-wider">Vibe da Campanha</label>
                    <div className="relative">
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all appearance-none font-medium"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                      >
                        <option value="Campanha Premium" className="bg-brand-surface">Visual Premium (Apetite Appeal)</option>
                        <option value="Promoção e Vendas" className="bg-brand-surface">Foco em Promoção (Varejo)</option>
                        <option value="Lançamento Exclusivo" className="bg-brand-surface">Mistério / Lançamento</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                        <Check size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-5 bg-red-500/10 text-red-400 rounded-2xl text-sm font-bold border border-red-500/20 flex items-center gap-3">
                    <X size={18} /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating || !file}
                  className={`w-full py-6 rounded-2xl font-bold text-base uppercase tracking-widest text-white shadow-2xl flex items-center justify-center transition-all relative overflow-hidden group/btn ${
                    isGenerating || !file
                      ? "bg-white/5 border border-white/5 text-white/10 cursor-not-allowed"
                      : "bg-brand-gradient hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-4 relative z-10">
                      <Loader2 size={24} className="animate-spin" />
                      <span>Processando Campanha...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 relative z-10">
                      <Star size={20} className="group-hover/btn:rotate-12 transition-transform" />
                      <span>Gerar Kit Dominação (5 ⚡)</span>
                    </div>
                  )}
                  {!isGenerating && file && (
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                  )}
                </button>
              </form>
            </div>

            {/* Empty State */}
            <div className="bg-brand-surface/30 border-2 border-dashed border-white/5 rounded-[40px] flex-1 flex flex-col items-center justify-center text-white/20 p-16 text-center group min-h-[600px]">
              <div className="flex gap-8 mb-10 opacity-20 group-hover:opacity-40 transition-all duration-700">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center shadow-2xl border border-white/5">
                  <ImageIcon size={40} />
                </div>
                <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center shadow-2xl border border-white/5 -translate-y-4">
                  <Smartphone size={48} className="text-brand-orange" />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center shadow-2xl border border-white/5">
                  <Layout size={40} />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white/40 mb-4 font-display">Tudo o que seu Delivery precisa</h4>
              <p className="text-base text-white/20 leading-relaxed max-w-sm font-medium">
                Uma inteligência treinada para criar imagens que abrem o apetite e textos que aceleram a decisão de compra.
              </p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-12"
          >
            {/* Header Result */}
            <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gradient opacity-10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl">
                  <Check size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white font-display">Kit Mestre Gerado!</h2>
                  <p className="text-white/40 font-medium mt-1">
                    Formatos otimizados para iFood, Instagram e WhatsApp.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResult(null)}
                className="px-10 py-4 bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-widest rounded-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Gerar Outro Prato
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {/* Formato: Post Feed */}
              <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col group/card hover:border-brand-orange/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-widest">Feed Instagram</h3>
                </div>
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-brand-dark border border-white/10 relative mb-10 group-hover/card:scale-[1.03] transition-transform duration-500 shadow-2xl">
                  <img src={result.imageUrl} className="w-full h-full object-cover" alt="Post Feed" />
                </div>
                <button 
                  onClick={() => handleDownload('square', 'feed')}
                  className="mt-auto w-full py-5 bg-white text-brand-dark font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-gradient hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  <Download size={18} /> Baixar para Feed
                </button>
              </div>

              {/* Formato: Stories */}
              <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col group/card hover:border-brand-red/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                    <Smartphone size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-widest">Story / Shorts</h3>
                </div>
                <div className="w-full aspect-[9/16] max-h-[400px] mx-auto rounded-2xl overflow-hidden bg-brand-dark border border-white/10 relative mb-10 group-hover/card:scale-[1.03] transition-transform duration-500 shadow-2xl flex items-center justify-center">
                  <img src={result.imageUrl} className="w-full h-full object-cover" alt="Stories" />
                </div>
                <button 
                  onClick={() => handleDownload('story', 'stories')}
                  className="mt-auto w-full py-5 bg-white text-brand-dark font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-gradient hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  <Download size={18} /> Baixar para Story
                </button>
              </div>

              {/* Formato: Banner / Capa */}
              <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col group/card hover:border-brand-yellow/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <Layout size={20} />
                  </div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-widest">Capa iFood / Banner</h3>
                </div>
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-brand-dark border border-white/10 relative mb-10 group-hover/card:scale-[1.03] transition-transform duration-500 shadow-2xl">
                  <img src={result.imageUrl} className="w-full h-full object-cover" alt="Banner" />
                </div>
                <button 
                  onClick={() => handleDownload('banner', 'capa')}
                  className="mt-auto w-full py-5 bg-white text-brand-dark font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-gradient hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  <Download size={18} /> Baixar para Capa
                </button>
              </div>
            </div>

            {/* Textos Gerados */}
            <div className="bg-brand-surface rounded-[40px] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient opacity-30" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full" />
              
              <div className="flex items-center gap-5 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20 shadow-xl">
                  <Type size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white font-display">Textos Persuasivos</h3>
                  <p className="text-white/40 font-medium mt-1">Nossa IA criou legendas otimizadas para converter visualizações em pedidos.</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-10 relative z-10">
                {result.copyTexts?.map((textObj: any, index: number) => (
                  <div key={index} className="bg-brand-dark/40 p-10 rounded-[32px] border border-white/5 relative group flex flex-col hover:bg-brand-dark/60 hover:border-brand-orange/20 transition-all shadow-inner">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(255,92,0,0.5)]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/40 font-display">
                          {textObj.label || `Opção Estratégica ${index + 1}`}
                        </span>
                      </div>
                      <Sparkles size={16} className="text-brand-yellow/30 group-hover:text-brand-yellow transition-colors" />
                    </div>
                    <p className="text-lg text-white/80 whitespace-pre-wrap flex-1 leading-relaxed font-medium">{textObj.text || textObj}</p>
                    
                    <button 
                      onClick={() => navigator.clipboard.writeText(textObj.text || textObj)}
                      className="mt-10 flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-orange hover:border-brand-orange transition-all group/copy shadow-xl active:scale-95"
                    >
                      <Copy size={16} className="group-hover/copy:scale-110 transition-transform" /> 
                      Copiar Legenda
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl relative z-10">
                <p className="text-sm text-brand-orange font-bold leading-relaxed flex items-start gap-3">
                  <Sparkles size={18} className="shrink-0 mt-0.5 animate-pulse" />
                  DICA PRO: Alterne entre as opções de texto durante a semana para testar qual gera mais cliques no seu perfil!
                </p>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
