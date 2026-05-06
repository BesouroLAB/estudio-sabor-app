"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Loader2, Download, Check, Sparkles, UploadCloud, X, Zap, Copy } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { uploadImage, generateFullKit, classifyImage } from "@/services/api";

export default function StoriesGeneratorPage() {
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

    if (userCredits < 2) {
      setError("Créditos insuficientes. Você precisa de 2 ⚡ para gerar este Story.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Upload da imagem
      const uploadedPath = await uploadImage(file);
      
      // 2. Classificação (se o usuário não digitou nada)
      let detectedFood = foodType;
      if (!detectedFood) {
        detectedFood = await classifyImage(uploadedPath, file.type);
        setFoodType(detectedFood);
      }

      // 3. Gerar Kit (Stories = 9:16, service = stories_rede_social)
      const referenceId = `story_${Date.now()}`;
      const kitResult = await generateFullKit(
        uploadedPath,
        file.type,
        detectedFood,
        style,
        "9:16",
        "stories_rede_social",
        referenceId,
        { keepAngle: false, keepBackground: false }
      );

      // Atualiza créditos se a API retornar
      if (kitResult.remaining_credits !== undefined) {
        setUserCredits(kitResult.remaining_credits);
      } else {
        setUserCredits(userCredits - 2); // Fallback otimista
      }

      setResult({
        imageUrl: kitResult.imageUrl,
        copyTexts: kitResult.copyTexts
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar seu story. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.imageUrl) return;
    try {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estudio-sabor-story-${Date.now()}.png`;
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
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={() => router.push('/estudio')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao painel</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
              <Flame size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display">Stories para Instagram</h1>
              <p className="text-slate-500 font-medium">Crie imagens verticais perfeitas (9:16) para engajar e vender mais nos stories.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-600">Seu Saldo:</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              <Zap size={14} className="fill-emerald-500" /> {userCredits}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Formulário */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-fit">
            <form onSubmit={handleGenerate} className="flex flex-col gap-6">
              
              {/* Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto Original *</label>
                {!previewUrl ? (
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                      <UploadCloud size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 mb-1">Clique ou arraste sua foto</span>
                    <span className="text-xs text-slate-400 text-center">Tire a foto de cima (top-down) ou em 45º com boa iluminação.</span>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                ) : (
                  <div className="relative w-full aspect-square max-h-[300px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex justify-center bg-slate-900">
                    <img src={previewUrl} className="h-full w-auto object-cover" alt="Preview" />
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
                  <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded font-bold uppercase tracking-wider">A I.A. pode adivinhar</span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Fatia de Pizza Pepperoni"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                />
              </div>

              {/* Estilo Visual */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Estilo da Arte</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all appearance-none"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="Moderno e Apetitoso">Moderno e Apetitoso (Recomendado)</option>
                  <option value="Focado em Oferta">Focado em Oferta / Promoção</option>
                  <option value="Stories Engajamento">Stories Engajamento (Perguntas/Enquetes)</option>
                  <option value="Dark Mode Premium">Dark Mode Premium</option>
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
                    : "bg-rose-600 hover:bg-rose-700 hover:-translate-y-1 hover:shadow-rose-600/25"
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Criando Story Profissional...</span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles size={18} /> Gerar Story (Custa 2 ⚡)</span>
                )}
              </button>
            </form>
          </div>

          {/* Resultado */}
          <div className="flex flex-col h-full">
            {!result ? (
              <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 font-medium p-8 text-center">
                <Flame size={48} className="mb-4 text-slate-300" />
                <p>Faça o upload da foto e deixe nossa I.A.<br/>criar o Story perfeito para suas vendas hoje.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Check size={16} className="text-emerald-500" /> Seu Story Pronto
                  </h3>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                  >
                    <Download size={16} /> Baixar Arte
                  </button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6 mb-6 h-full min-h-[400px]">
                  {/* Imagem (Story 9:16) */}
                  <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 flex items-center justify-center relative shadow-inner aspect-[9/16] mx-auto w-full max-w-[300px]">
                    <img src={result.imageUrl} alt="Arte gerada" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Legenda(s) / Textos para inserir no app */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Textos para Usar</h4>
                    <p className="text-xs text-slate-400">Copie estes textos para colar como figurinhas no seu Instagram.</p>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {result.copyTexts?.map((textObj: any, index: number) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{textObj.text || textObj}</p>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(textObj.text || textObj);
                            }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white shadow-sm text-slate-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600"
                            title="Copiar Texto"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
