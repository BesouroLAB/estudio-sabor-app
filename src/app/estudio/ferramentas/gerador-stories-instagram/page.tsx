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
    <div className="flex-1 overflow-y-auto bg-brand-dark min-h-screen">
      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={() => router.push('/estudio')}
          className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao painel</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient p-[1px]">
              <div className="w-full h-full rounded-2xl bg-brand-dark flex items-center justify-center text-white">
                <Flame size={32} className="text-brand-orange" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-display mb-2">Stories que Vendem</h1>
              <p className="text-white/60 font-medium max-w-md">Crie artes verticais (9:16) profissionais para engajar seguidores e converter em pedidos.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-brand-surface px-6 py-3 rounded-2xl border border-white/5 shadow-xl">
            <span className="text-sm font-medium text-white/40">Seu Saldo:</span>
            <span className="flex items-center gap-2 text-brand-yellow font-bold text-lg">
              <Zap size={18} className="fill-brand-yellow" /> {userCredits}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[450px_1fr] gap-8 items-start">
          {/* Formulário */}
          <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gradient opacity-5 blur-3xl" />
            
            <form onSubmit={handleGenerate} className="flex flex-col gap-8 relative z-10">
              
              {/* Upload Area */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-white/80 uppercase tracking-wider">Foto do seu Prato</label>
                {!previewUrl ? (
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-white/40 hover:bg-white/[0.02] hover:border-brand-orange/50 transition-all cursor-pointer group/upload"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover/upload:scale-110 group-hover/upload:text-brand-orange transition-all">
                      <UploadCloud size={32} />
                    </div>
                    <span className="text-base font-bold text-white/80 mb-1">Arraste sua foto aqui</span>
                    <span className="text-sm text-white/40 text-center">Ângulo 45º ou Top-down</span>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                ) : (
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-dark group/preview">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-end p-4">
                      <button 
                        type="button"
                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                        className="w-full py-2 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <X size={16} /> Remover Foto
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nome do Prato */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-white/80 uppercase tracking-wider">O que é este prato?</label>
                  <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-full font-bold border border-brand-orange/20">DETECÇÃO AUTOMÁTICA</span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Hambúrguer Artesanal com Fritas"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all font-medium"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                />
              </div>

              {/* Estilo Visual */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-white/80 uppercase tracking-wider">Vibe do Story</label>
                <div className="relative">
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all appearance-none font-medium"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option value="Moderno e Apetitoso" className="bg-brand-surface text-white">Moderno e Apetitoso</option>
                    <option value="Focado em Oferta" className="bg-brand-surface text-white">Oferta Irresistível</option>
                    <option value="Stories Engajamento" className="bg-brand-surface text-white">Engajamento (Interação)</option>
                    <option value="Dark Mode Premium" className="bg-brand-surface text-white">Dark Mode Premium</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <Check size={16} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl text-sm font-medium border border-red-500/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating || !file}
                className={`w-full py-5 rounded-2xl font-bold text-white shadow-2xl flex items-center justify-center transition-all relative overflow-hidden group/btn ${
                  isGenerating || !file
                    ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                    : "bg-brand-gradient hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-3 relative z-10">
                    <Loader2 size={24} className="animate-spin text-white" /> 
                    Criando Story Mágico...
                  </span>
                ) : (
                  <span className="flex items-center gap-3 relative z-10 text-lg">
                    <Sparkles size={22} /> 
                    Gerar Story Profissional (2 ⚡)
                  </span>
                )}
                {!isGenerating && file && (
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                )}
              </button>
            </form>
          </div>

          {/* Resultado */}
          <div className="flex flex-col h-full min-h-[600px]">
            {!result ? (
              <div className="bg-brand-surface/30 border-2 border-dashed border-white/5 rounded-[32px] flex-1 flex flex-col items-center justify-center text-white/20 p-12 text-center group">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Flame size={48} className="text-white/10" />
                </div>
                <h3 className="text-xl font-bold text-white/40 mb-2">Aguardando sua obra-prima</h3>
                <p className="max-w-xs mx-auto leading-relaxed font-medium">Suba uma foto e veja a mágica do Estúdio transformar seu prato em um story irresistível.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gradient opacity-5 blur-[100px]" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <Check size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display uppercase tracking-wider">Story Gerado!</h3>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-2xl font-bold hover:bg-brand-yellow transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Download size={18} /> Baixar Arte
                  </button>
                </div>
                
                <div className="grid md:grid-cols-[320px_1fr] gap-10 h-full relative z-10">
                  {/* Preview da Arte */}
                  <div className="flex flex-col gap-4 mx-auto w-full max-w-[320px]">
                    <div className="rounded-3xl overflow-hidden border border-white/10 bg-brand-dark shadow-2xl aspect-[9/16] relative group/result">
                      <img src={result.imageUrl} alt="Arte gerada" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover/result:opacity-10 transition-opacity" />
                    </div>
                    <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-widest">Visualização Story Instagram</p>
                  </div>
                  
                  {/* Legenda(s) / Textos para inserir no app */}
                  <div className="flex flex-col gap-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-brand-orange">Copie para o seu Story</h4>
                      <p className="text-sm text-white/40 font-medium leading-relaxed">Clique no texto para copiar e colar diretamente no Instagram como figurinha de texto.</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar max-h-[500px]">
                      {result.copyTexts?.map((textObj: any, index: number) => (
                        <div 
                          key={index} 
                          onClick={() => {
                            navigator.clipboard.writeText(textObj.text || textObj);
                          }}
                          className="bg-white/5 p-6 rounded-2xl border border-white/5 relative group cursor-pointer hover:bg-white/[0.08] hover:border-brand-orange/30 transition-all"
                        >
                          <p className="text-base text-white/90 leading-relaxed font-medium whitespace-pre-wrap">{textObj.text || textObj}</p>
                          <div className="absolute top-4 right-4 text-white/20 group-hover:text-brand-orange transition-colors">
                            <Copy size={16} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto p-5 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl">
                      <p className="text-xs text-brand-orange/80 font-bold leading-relaxed flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 shrink-0" />
                        DICA: Use estes textos em fontes diferentes no Instagram para criar um Story dinâmico e atraente!
                      </p>
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
