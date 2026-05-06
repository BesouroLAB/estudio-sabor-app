"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Image as ImageIcon, Loader2, Download, Check, Sparkles, UploadCloud, X, Zap, Copy } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { uploadImage, generateFullKit, classifyImage } from "@/services/api";

export default function PostFeedGeneratorPage() {
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
      setError("Créditos insuficientes. Você precisa de 2 ⚡ para gerar este post.");
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

      // 3. Gerar Kit (Post Feed = 1:1, service = post_rede_social)
      const referenceId = `post_${Date.now()}`;
      const kitResult = await generateFullKit(
        uploadedPath,
        file.type,
        detectedFood,
        style,
        "1:1",
        "post_rede_social",
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
      setError(err.message || "Ocorreu um erro ao gerar seu post. Tente novamente.");
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
      link.download = `estudio-sabor-post-${Date.now()}.png`;
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
    <div className="flex-1 overflow-y-auto bg-brand-dark min-h-screen text-white relative">
      {/* Brand Aura Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        <button
          onClick={() => router.push('/estudio')}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao painel</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-xl shadow-brand-red/20">
              <ImageIcon size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white font-display uppercase tracking-tight flex items-center gap-3">
                Post para Feed <span className="bg-brand-gradient bg-clip-text text-transparent italic">Instagram</span>
              </h1>
              <p className="text-slate-400 font-medium max-w-md">Transforme fotos simples em posts profissionais com arte 1:1 e legenda inclusa.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-brand-surface px-6 py-3 rounded-2xl border border-white/5 shadow-2xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo</span>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <span className="flex items-center gap-1.5 text-brand-orange font-black bg-brand-orange/10 px-3 py-1 rounded-lg border border-brand-orange/20">
              <Zap size={14} className="fill-brand-orange" /> {userCredits}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
          {/* Formulário */}
          <div className="bg-brand-surface rounded-[40px] p-10 border border-white/5 shadow-2xl h-fit relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient" />
            
            <form onSubmit={handleGenerate} className="flex flex-col gap-8">
              {/* Upload */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Foto Original *</label>
                {!previewUrl ? (
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-500 hover:bg-white/[0.02] hover:border-brand-red/30 transition-all cursor-pointer group/upload"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover/upload:scale-110 group-hover/upload:text-brand-red transition-all border border-white/5">
                      <UploadCloud size={32} />
                    </div>
                    <span className="text-lg font-bold text-white mb-2 text-center">Clique ou arraste sua foto</span>
                    <span className="text-xs text-slate-500 text-center max-w-xs leading-relaxed">
                      Tire a foto de cima (top-down) ou em 45º com boa iluminação.
                    </span>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                ) : (
                  <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-brand-dark group/preview">
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                        className="bg-brand-red text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-110 transition-all flex items-center gap-2"
                      >
                        <X size={14} /> Substituir
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nome do Prato */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">O que é isso? (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Hambúrguer Duplo com Cheddar"
                  className="w-full bg-brand-dark/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/40 transition-all font-medium"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                />
              </div>

              {/* Estilo Visual */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Estilo da Arte</label>
                <select
                  className="w-full bg-brand-dark/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/40 transition-all font-medium appearance-none"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="Moderno e Apetitoso">Moderno e Apetitoso (Recomendado)</option>
                  <option value="Rústico e Artesanal">Rústico e Artesanal</option>
                  <option value="Minimalista Clean">Minimalista Clean</option>
                  <option value="Dark Mode Premium">Dark Mode Premium</option>
                </select>
              </div>

              {error && (
                <div className="p-5 bg-brand-red/10 text-brand-red rounded-2xl text-sm font-bold border border-brand-red/20 flex items-center gap-3">
                  <X size={18} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating || !file}
                className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-2xl flex items-center justify-center transition-all relative overflow-hidden group/btn ${
                  isGenerating || !file
                    ? "bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed"
                    : "bg-brand-gradient hover:scale-[1.02] active:scale-95 shadow-brand-red/20"
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Criando Arte...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span>Gerar Post (2 ⚡)</span>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Resultado */}
          <div className="flex flex-col h-full">
            {!result ? (
              <div className="bg-brand-surface/30 border border-white/5 border-dashed rounded-[40px] h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 p-10 text-center group">
                <ImageIcon size={48} className="mb-6 opacity-20 group-hover:opacity-40 transition-opacity" />
                <h4 className="text-white font-bold text-lg mb-3">Seu Post Profissional</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  Faça o upload e deixe nossa I.A. criar uma arte perfeita para o seu feed em segundos.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-surface rounded-[40px] p-8 border border-white/5 shadow-2xl flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                      <Check size={16} />
                    </div>
                    Resultado Final
                  </h3>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-gradient hover:text-white transition-all shadow-xl"
                  >
                    <Download size={14} /> Baixar Arte
                  </button>
                </div>
                
                <div className="grid gap-8">
                  {/* Imagem */}
                  <div className="rounded-[24px] overflow-hidden border border-white/5 bg-brand-dark aspect-square relative shadow-2xl group/res">
                    <img src={result.imageUrl} alt="Arte gerada" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/res:opacity-100 transition-opacity flex items-center justify-center">
                       <Sparkles size={40} className="text-white animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Legenda(s) */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                       <div className="h-[1px] flex-1 bg-white/5" />
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Sugestões de Legenda</span>
                       <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {result.copyTexts?.map((textObj: any, index: number) => (
                        <div key={index} className="bg-brand-dark/50 p-6 rounded-[24px] border border-white/5 relative group/copy">
                          <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{textObj.text || textObj}</p>
                          <button 
                            onClick={() => navigator.clipboard.writeText(textObj.text || textObj)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center opacity-0 group-hover/copy:opacity-100 transition-all hover:bg-brand-red hover:text-white border border-white/10"
                            title="Copiar Legenda"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setResult(null)}
                  className="mt-10 w-full py-4 border border-white/10 text-slate-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white/5"
                >
                  Criar Outro Post
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
