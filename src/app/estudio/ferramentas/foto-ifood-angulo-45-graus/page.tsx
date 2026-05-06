"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Camera, 
  ShieldCheck, 
  Info,
  Rotate3D
} from "lucide-react";

export default function FotoIfoodAngulo45GrausPage() {
  const router = useRouter();

  // State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const applyTransformation = async () => {
    if (!imageSrc || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    try {
      const image = new Image();
      image.src = imageSrc;
      
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Contexto 2D não suportado");

      // Para criar o efeito isométrico (45 graus + achatamento):
      // 1. Precisamos de um canvas maior para caber a imagem rotacionada
      const diagonal = Math.sqrt(image.width ** 2 + image.height ** 2);
      canvas.width = diagonal;
      canvas.height = diagonal * 0.6; // Fator de achatamento isométrico

      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mover para o centro
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Aplicar o achatamento vertical (escala) para dar a perspectiva
      ctx.scale(1, 0.5);
      
      // Rotacionar em 45 graus
      ctx.rotate((45 * Math.PI) / 180);
      
      // Desenhar a imagem centralizada
      ctx.drawImage(image, -image.width / 2, -image.height / 2);

      // Converter para URL e salvar no state
      const url = canvas.toDataURL("image/png");
      setResultUrl(url);

    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao transformar a imagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setImageSrc(null);
    setResultUrl(null);
  };  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark min-h-screen pb-20 text-white relative">
      {/* Brand Aura Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* HEADER & BREADCRUMBS */}
      <div className="bg-brand-surface/50 backdrop-blur-xl border-b border-white/5 pt-8 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto px-8">
          <button
            onClick={() => router.push("/estudio")}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 w-fit text-[10px] font-black uppercase tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao painel</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-lg shadow-brand-red/20">
                  <Camera size={18} className="text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white font-display uppercase tracking-tight">
                  Ângulo <span className="bg-brand-gradient bg-clip-text text-transparent">45º iFood</span>
                </h1>
              </div>
              <p className="text-slate-400 text-sm max-w-xl">
                Transforme fotos planas em apresentações isométricas 3D de alta conversão para o seu cardápio.
              </p>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <ShieldCheck size={16} className="text-emerald-500" />
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">SEO Profissional Ativo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: INFO & TIPS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="w-12 h-12 bg-brand-gradient text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform">
                <Rotate3D size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Poder Isométrico</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                O formato isométrico é o segredo das grandes marcas. Ele entrega volume e sofisticação, aumentando a percepção de valor do seu produto instantaneamente.
              </p>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest block mb-2">Dica de Elite</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal para imagens recortadas (fundo transparente) ou caixas de delivery que precisam de destaque.
                </p>
              </div>
            </div>

            {/* Dicas Dinâmicas */}
            <div className="bg-gradient-to-br from-brand-surface to-brand-dark rounded-[32px] p-8 border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 text-brand-red mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center">
                  <Info size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Estratégia Visual</span>
              </div>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    Use fotos <span className="text-white font-bold">Top-Down</span> (vistas de cima) para o melhor resultado.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    Pratos redondos ganham um efeito de profundidade elegante e profissional.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    Perfeito para simular <span className="text-white font-bold">caixas 3D</span> de pizzas e hambúrgueres.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: EDITOR */}
          <div className="lg:col-span-8">
            <div className="bg-brand-surface rounded-[40px] p-10 border border-white/5 shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient opacity-50" />
              
              {!imageSrc ? (
                /* Empty State / Upload */
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-white/5 text-slate-700 rounded-[32px] flex items-center justify-center mb-8 border border-white/5 group hover:border-brand-red/30 transition-all cursor-pointer">
                    <Upload size={40} className="group-hover:text-brand-red transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 text-center">Prepare sua Vitrine 3D</h3>
                  <p className="text-slate-400 text-center max-w-sm mb-10 leading-relaxed">
                    Envie a foto do seu prato ou embalagem para aplicar o ângulo isométrico profissional.
                  </p>
                  
                  <label className="px-10 py-5 bg-brand-gradient hover:scale-105 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-brand-red/20 flex items-center gap-3 cursor-pointer active:scale-95 group">
                    <Upload size={20} className="group-hover:bounce" />
                    Selecionar Imagem
                    <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
                  </label>
                  <div className="mt-8 flex items-center gap-6 opacity-40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG / PNG</span>
                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fundo Transparente</span>
                  </div>
                </div>
              ) : (
                /* Editor State */
                <div className="flex flex-col h-full animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                    <div>
                      <h3 className="font-bold text-white text-xl">Prévia do Resultado</h3>
                      <p className="text-sm text-slate-500">Ajuste e visualize o efeito antes de baixar.</p>
                    </div>
                    <button 
                      onClick={resetAll}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest border border-white/5"
                    >
                      Trocar Foto
                    </button>
                  </div>

                  <div className="flex-1 grid md:grid-cols-12 gap-10">
                    
                    {/* Preview Container */}
                    <div className="md:col-span-8 flex flex-col gap-4">
                      <div className="relative w-full aspect-square bg-brand-dark rounded-[32px] overflow-hidden border border-white/5 flex items-center justify-center p-12 group">
                        {/* Checkerboard Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                        
                        {!resultUrl ? (
                          // CSS Preview
                          <div className="relative w-full h-full flex items-center justify-center">
                             <img 
                               src={imageSrc} 
                               alt="Original" 
                               className="max-w-[85%] max-h-[85%] object-contain transition-all duration-1000"
                               style={{
                                 transform: "perspective(1200px) rotateX(60deg) rotateZ(-45deg)",
                                 filter: "drop-shadow(-30px 40px 50px rgba(0,0,0,0.5))"
                               }}
                             />
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-brand-red uppercase tracking-[0.3em] opacity-50">
                               Modo Visualização
                             </div>
                          </div>
                        ) : (
                          // Final Result Image
                          <div className="relative w-full h-full flex items-center justify-center z-10 animate-in zoom-in duration-500">
                            <img src={resultUrl} alt="Pronto" className="max-w-full max-h-full object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.8)]" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                      <canvas ref={canvasRef} className="hidden" />

                      {!resultUrl ? (
                        <div className="bg-white/5 rounded-[32px] p-8 border border-white/5 flex-1 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-brand-surface text-brand-red rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5">
                            <Rotate3D size={32} />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-3">Aplicar Transformação</h4>
                          <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                            Nossa IA processará sua imagem para fixar o ângulo de 45º em alta resolução.
                          </p>
                          
                          <button
                            onClick={applyTransformation}
                            disabled={isProcessing}
                            className="w-full py-5 bg-brand-gradient hover:scale-[1.02] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-brand-red/20 flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50 disabled:grayscale"
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processando...</span>
                              </div>
                            ) : (
                              <>
                                <Rotate3D size={20} />
                                <span>Gerar Imagem</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/5 rounded-[32px] p-8 border border-emerald-500/10 flex-1 flex flex-col items-center justify-center text-center animate-in slide-in-from-right-4 duration-500">
                          <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                            <ShieldCheck size={32} />
                          </div>
                          <h4 className="font-bold text-white text-lg mb-2">Transformação Ativa</h4>
                          <p className="text-[10px] text-emerald-500 font-black mb-10 uppercase tracking-[0.2em]">
                            Renderização Completa
                          </p>

                          <a 
                            href={resultUrl} 
                            download={`foto-ifood-45graus-estudiosabor.png`}
                            className="w-full py-5 bg-brand-gradient hover:scale-[1.02] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-brand-red/20 flex justify-center items-center gap-3 active:scale-95 mb-4"
                          >
                            <Download size={20} />
                            Baixar PNG
                          </a>

                          <button 
                            onClick={() => setResultUrl(null)}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                          >
                            Nova Edição
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
