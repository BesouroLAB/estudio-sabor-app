"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ImageIcon, Loader2, Sparkles, Upload, Zap, Download } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { uploadImage, generateImage } from "@/services/api";
import { createClient } from "@/lib/supabase/client";

export default function EnhanceToolPage() {
  const router = useRouter();
  const { userCredits, setUserCredits } = useDashboard();
  const supabase = createClient();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const REQUIRED_CREDITS = 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;

    if (userCredits < REQUIRED_CREDITS) {
      alert("Créditos insuficientes! Você precisa de 1 crédito para usar esta ferramenta premium.");
      router.push('/estudio'); // Ou abrir a loja
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      // 1. Upload
      const uploadedPath = await uploadImage(selectedFile);
      
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      // 2. Generate
      // Usaremos o prompt padrão de "aprimorar qualidade, iluminação profissional de comida"
      const prompt = "professional food photography, 4k resolution, highly detailed, perfect studio lighting, appetizing, mouth-watering, sharp focus";
      
      const result = await generateImage(
        uploadedPath, 
        selectedFile.type, 
        prompt, 
        userId,
        'aprimorar_imagem' // Service ID para descontar 1 crédito na RPC
      );

      setResultUrl(`data:${result.mimeType};base64,${result.base64Image}`);
      
      // Atualiza os créditos locais assumindo que gastou 1
      setUserCredits((prev: number) => Math.max(0, prev - REQUIRED_CREDITS));
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao aprimorar imagem. Tente novamente.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark min-h-screen text-white relative">
      {/* Brand Aura Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-red/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2" />

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.push('/estudio')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao painel</span>
          </button>
          
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Zap size={14} className="text-brand-orange fill-brand-orange animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Custo: {REQUIRED_CREDITS} Crédito</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-brand-surface flex items-center justify-center text-white border border-white/10">
              <Sparkles size={32} className="text-brand-orange" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight font-display mb-1">Aprimorar Prato</h1>
            <p className="text-slate-400 font-medium text-lg">Melhore a iluminação e a suculência do seu prato com I.A.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Lado Esquerdo: Upload */}
          <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
            {!previewUrl ? (
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-brand-red/50 transition-all cursor-pointer min-h-[350px] group">
                <div className="w-20 h-20 rounded-full bg-brand-dark flex items-center justify-center text-brand-red mb-6 shadow-xl border border-white/5 group-hover:scale-110 transition-transform">
                  <Upload size={28} />
                </div>
                <span className="font-black text-white mb-2 uppercase tracking-widest text-xs">Enviar Foto do Prato</span>
                <span className="text-sm text-slate-500">JPG ou PNG (Até 5MB)</span>
                <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="relative rounded-2xl overflow-hidden bg-brand-dark border border-white/10 mb-8 group aspect-square flex items-center justify-center shadow-inner">
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  {!isEnhancing && !resultUrl && (
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center mb-2">
                        <Upload size={20} />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-widest">Trocar foto</span>
                      <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-xl text-sm font-bold">
                    {error}
                  </div>
                )}

                {!resultUrl && (
                  <button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm text-white shadow-2xl flex items-center justify-center transition-all ${
                      isEnhancing
                        ? "bg-white/10 shadow-none cursor-not-allowed text-slate-500"
                        : "bg-brand-gradient hover:brightness-110 hover:-translate-y-1 shadow-brand-red/20"
                    }`}
                  >
                    {isEnhancing ? (
                      <span className="flex items-center gap-3"><Loader2 size={20} className="animate-spin" /> Mágica acontecendo...</span>
                    ) : (
                      <span className="flex items-center gap-3"><Sparkles size={20} /> Melhorar Foto Agora</span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Lado Direito: Resultado */}
          <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl flex flex-col relative overflow-hidden">
            <h3 className="text-white font-black mb-8 flex items-center gap-3 text-sm uppercase tracking-widest">
              <ImageIcon className="text-brand-red" size={20} /> 
              Resultado Premium
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-brand-dark/50 overflow-hidden relative min-h-[350px] shadow-inner">
              {!resultUrl ? (
                isEnhancing ? (
                  <div className="flex flex-col items-center text-brand-red">
                    <Loader2 size={48} className="animate-spin mb-6" />
                    <span className="font-bold uppercase tracking-widest text-[10px] animate-pulse text-slate-400">Aprimorando iluminação e texturas...</span>
                  </div>
                ) : (
                  <div className="text-slate-600 font-bold text-center p-12 max-w-xs text-xs uppercase tracking-[0.2em] leading-relaxed">
                    Faça o upload e clique em melhorar para ver o poder da I.A.
                  </div>
                )
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-brand-dark animate-fade-up">
                  <img src={resultUrl} alt="Resultado Aprimorado" className="w-full h-full object-contain" />
                  <div className="absolute bottom-8 inset-x-0 flex justify-center">
                    <a 
                      href={resultUrl} 
                      download="prato-aprimorado.png" 
                      target="_blank"
                      className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-xs shadow-2xl flex items-center gap-3 hover:-translate-y-1 transition-all"
                    >
                      <Download size={20} />
                      Baixar em Alta
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {resultUrl && (
              <button 
                onClick={() => { setResultUrl(null); setPreviewUrl(null); setSelectedFile(null); }}
                className="mt-8 w-full py-5 border border-white/10 text-slate-400 rounded-2xl font-black uppercase tracking-[0.1em] text-xs hover:bg-white/5 hover:text-white transition-all"
              >
                Aprimorar outra foto
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
