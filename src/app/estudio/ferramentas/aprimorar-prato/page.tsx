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
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/estudio')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao painel</span>
          </button>
          
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-slate-700">Custo: {REQUIRED_CREDITS} Crédito</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-display">Aprimorar Prato</h1>
            <p className="text-slate-500 font-medium">Melhore a iluminação, nitidez e aparência do seu prato com I.A.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Lado Esquerdo: Upload */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
            {!previewUrl ? (
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-amber-300 transition-colors cursor-pointer min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-amber-500 mb-4 shadow-sm">
                  <Upload size={24} />
                </div>
                <span className="font-bold text-slate-700 mb-1">Clique para enviar a foto</span>
                <span className="text-sm text-slate-400">JPG ou PNG (Até 5MB)</span>
                <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-6 group aspect-square flex items-center justify-center">
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  {!isEnhancing && !resultUrl && (
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload size={24} className="mb-2" />
                      <span className="font-medium text-sm">Trocar foto</span>
                      <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                {!resultUrl && (
                  <button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${
                      isEnhancing
                        ? "bg-amber-400 shadow-none cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 hover:-translate-y-1 hover:shadow-amber-500/25"
                    }`}
                  >
                    {isEnhancing ? (
                      <span className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Mágica acontecendo...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Sparkles size={20} /> Melhorar Foto Agora</span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Lado Direito: Resultado */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EAEAEC] flex flex-col">
            <h3 className="text-[#1A1A1A] font-bold mb-6 flex items-center gap-2 text-xl font-display">
              <ImageIcon className="text-[#EA1D2C]" size={24} /> 
              Resultado Premium
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#EAEAEC] bg-[#F7F7F7] overflow-hidden relative min-h-[300px]">
              {!resultUrl ? (
                isEnhancing ? (
                  <div className="flex flex-col items-center text-[#EA1D2C]">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <span className="font-medium animate-pulse text-[#3E3E3E]">Ajustando iluminação e texturas...</span>
                  </div>
                ) : (
                  <div className="text-[#717171] font-medium text-center p-8 max-w-xs">
                    Faça o upload e clique em melhorar para ver a mágica da I.A. em sua foto.
                  </div>
                )
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-white">
                  <img src={resultUrl} alt="Resultado Aprimorado" className="w-full h-full object-contain" />
                  <div className="absolute bottom-6 inset-x-0 flex justify-center">
                    <a 
                      href={resultUrl} 
                      download="prato-aprimorado.png" 
                      target="_blank"
                      className="bg-[#EA1D2C] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 hover:-translate-y-1 transition-all"
                    >
                      <Download size={20} />
                      Baixar Imagem em Alta
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {resultUrl && (
              <button 
                onClick={() => { setResultUrl(null); setPreviewUrl(null); setSelectedFile(null); }}
                className="mt-6 w-full py-4 border-2 border-[#EAEAEC] text-[#3E3E3E] rounded-xl font-bold hover:bg-[#F7F7F7] hover:border-[#D1D1D6] transition-all"
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
