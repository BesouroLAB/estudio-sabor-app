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
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] min-h-screen">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={() => router.push('/estudio')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao painel</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm border border-purple-200">
              <Star size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-2">
                Kit Completo Mágico <Sparkles size={20} className="text-purple-500" />
              </h1>
              <p className="text-slate-500 font-medium">1 Foto = Múltiplos formatos e textos gerados instantaneamente para dominar todas as redes.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-600">Seu Saldo:</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              <Zap size={14} className="fill-emerald-500" /> {userCredits}
            </span>
          </div>
        </div>

        {!result ? (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
            {/* Formulário */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-fit relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500" />
              
              <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                {/* Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Foto Original *</label>
                  {!previewUrl ? (
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                        <UploadCloud size={24} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 mb-1">Clique ou arraste a melhor foto</span>
                      <span className="text-xs text-slate-400 text-center">Vamos transformar essa única foto em todo o seu marketing.</span>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                      <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Nome do Prato */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-700">O que é isso? (Opcional)</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: Combo Família Premium"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                  />
                </div>

                {/* Estilo Visual */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Estilo da Campanha</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all appearance-none"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option value="Campanha Premium">Campanha Premium (Foco em Qualidade)</option>
                    <option value="Promoção e Vendas">Promoção e Oferta (Foco em Desconto)</option>
                    <option value="Lançamento Exclusivo">Lançamento Exclusivo (Gatilho de Novidade)</option>
                  </select>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating || !file}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${
                    isGenerating || !file
                      ? "bg-slate-300 shadow-none cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 hover:-translate-y-1 hover:shadow-purple-600/25"
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Mágica acontecendo...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Star size={18} /> Criar Todo o Material (Custa 5 ⚡)</span>
                  )}
                </button>
              </form>
            </div>

            {/* Preview Vazio */}
            <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 font-medium p-8 text-center">
              <div className="flex gap-4 mb-6 opacity-30">
                <ImageIcon size={40} />
                <Smartphone size={40} />
                <Layout size={40} />
              </div>
              <p>Envie sua foto e nós faremos o trabalho duro.<br/>Geraremos opções para Feed, Stories, Capa e os textos ideais.</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Header Result */}
            <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-[0_4px_20px_-5px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Check size={24} className="text-emerald-500" /> Seu Kit está pronto para dominar as vendas!
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Baixe as imagens em diferentes formatos e copie os textos estratégicos abaixo.
                </p>
              </div>
              <button
                onClick={() => setResult(null)}
                className="text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors"
              >
                Gerar Novo Kit
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Formato: Post Feed */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon size={18} className="text-blue-500" />
                  <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Post (1:1)</h3>
                </div>
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative mb-4">
                  <img src={result.imageUrl} className="w-full h-full object-cover" alt="Post Feed" />
                </div>
                <button 
                  onClick={() => handleDownload('square', 'feed')}
                  className="mt-auto w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={16} /> Baixar Post
                </button>
              </div>

              {/* Formato: Stories */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone size={18} className="text-rose-500" />
                  <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Stories (9:16)</h3>
                </div>
                <div className="w-full aspect-[9/16] max-h-[300px] mx-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative mb-4 flex items-center justify-center">
                  <img src={result.imageUrl} className="w-full h-full object-cover" alt="Stories" />
                </div>
                <button 
                  onClick={() => handleDownload('story', 'stories')}
                  className="mt-auto w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={16} /> Baixar Story
                </button>
              </div>

              {/* Formato: Banner / Capa */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Layout size={18} className="text-amber-500" />
                  <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Capa / Banner (16:9)</h3>
                </div>
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative mb-4">
                  <img src={result.imageUrl} className="w-full h-full object-cover" alt="Banner" />
                </div>
                <button 
                  onClick={() => handleDownload('banner', 'capa')}
                  className="mt-auto w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={16} /> Baixar Banner
                </button>
              </div>
            </div>

            {/* Textos Gerados */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                <Type size={20} className="text-purple-500" /> Textos para acompanhar suas imagens
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {result.copyTexts?.map((textObj: any, index: number) => (
                  <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">
                      {textObj.label || `Sugestão de Texto ${index + 1}`}
                    </span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap flex-1">{textObj.text || textObj}</p>
                    
                    <button 
                      onClick={() => navigator.clipboard.writeText(textObj.text || textObj)}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:text-purple-600 hover:border-purple-200 transition-all"
                    >
                      <Copy size={14} /> Copiar Texto
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
