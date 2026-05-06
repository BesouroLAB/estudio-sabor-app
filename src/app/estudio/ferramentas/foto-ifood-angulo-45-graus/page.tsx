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
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] min-h-screen pb-20">
      
      {/* HEADER & BREADCRUMBS */}
      <div className="bg-white border-b border-[#EAEAEC] pt-6 pb-6">
        <div className="max-w-6xl mx-auto px-8">
          <button
            onClick={() => router.push("/estudio")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4 w-fit text-sm"
          >
            <ArrowLeft size={14} />
            <span>Voltar ao painel</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-3">
                <Camera className="text-[#EA1D2C]" />
                Foto iFood <span className="text-[#EA1D2C]">Ângulo 45º</span>
              </h1>
              <p className="text-slate-500 mt-1">Transforme fotos planas em apresentações isométricas 3D de alta conversão.</p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
               <ShieldCheck size={16} className="text-green-500" />
               <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">SEO Pro Max Ativado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: INFO & TIPS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#EAEAEC] shadow-sm">
              <div className="w-12 h-12 bg-red-50 text-[#EA1D2C] rounded-2xl flex items-center justify-center mb-4">
                <Rotate3D size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Por que usar o ângulo de 45º?</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                O formato isométrico (45 graus) é uma tendência de design premium. Ele dá volume e sofisticação aos pratos, embalagens e combos, fazendo com que pareçam mais caros e apetitosos.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Dica de Sucesso</span>
                <p className="text-xs text-slate-600">
                  Ideal para imagens que já não possuem fundo (recortadas) ou caixas de delivery.
                </p>
              </div>
            </div>

            {/* Dicas Dinâmicas */}
            <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
              <div className="flex items-center gap-2 text-[#EA1D2C] mb-4">
                <Info size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Dicas de Especialista</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-4">Como obter o melhor resultado:</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EA1D2C] shrink-0" />
                  Envie fotos com fundo transparente ou branco para um efeito flutuante.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EA1D2C] shrink-0" />
                  Pratos redondos ganham um efeito de elipse muito elegante neste ângulo.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EA1D2C] shrink-0" />
                  Se for usar para embalagens quadradas (ex: pizza), a caixa parecerá em 3D.
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: EDITOR */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 border border-[#EAEAEC] shadow-sm min-h-[500px] flex flex-col">
              
              {!imageSrc ? (
                /* Empty State / Upload */
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
                    <Upload size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Comece enviando sua foto</h3>
                  <p className="text-slate-500 text-center max-w-sm mb-8">
                    Para um efeito perfeito de 45 graus, recomendamos fotos de pratos vistos de cima (Top-Down).
                  </p>
                  
                  <label className="px-8 py-4 bg-[#EA1D2C] hover:bg-[#d1192a] text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-3 cursor-pointer active:scale-95">
                    <Upload size={20} />
                    Selecionar Imagem do Computador
                    <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
                  </label>
                  <p className="text-xs text-slate-400 mt-4 italic">Formatos aceitos: JPG, PNG • Recomendado com fundo transparente</p>
                </div>
              ) : (
                /* Editor State */
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Visualização</h3>
                      <p className="text-sm text-slate-500">Veja a prévia do efeito 3D isométrico aplicado.</p>
                    </div>
                    <button 
                      onClick={resetAll}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Trocar Foto
                    </button>
                  </div>

                  <div className="flex-1 grid md:grid-cols-12 gap-8">
                    
                    {/* Preview Container */}
                    <div className="md:col-span-8 flex flex-col gap-4">
                      <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-8 bg-[url('/checkers.svg')]">
                        {/* Checkerboard CSS pattern as background for transparent images */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        
                        {!resultUrl ? (
                          // CSS Preview
                          <div className="relative w-full h-full flex items-center justify-center">
                             <img 
                               src={imageSrc} 
                               alt="Original" 
                               className="max-w-[70%] max-h-[70%] object-contain transition-transform duration-700 hover:scale-105"
                               style={{
                                 transform: "perspective(1000px) rotateX(60deg) rotateZ(-45deg)",
                                 boxShadow: "-20px 20px 30px rgba(0,0,0,0.15)"
                               }}
                             />
                          </div>
                        ) : (
                          // Final Result Image
                          <div className="relative w-full h-full flex items-center justify-center z-10">
                            <img src={resultUrl} alt="Pronto" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                      {/* Hidden Canvas for Processing */}
                      <canvas ref={canvasRef} className="hidden" />

                      {!resultUrl ? (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-1 flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 bg-white text-[#EA1D2C] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                            <Rotate3D size={24} />
                          </div>
                          <h4 className="text-bold text-slate-800 mb-2">Aplicar Ângulo 45º</h4>
                          <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                            Vamos processar a imagem e gerar um arquivo PNG com o efeito isométrico fixado.
                          </p>
                          
                          <button
                            onClick={applyTransformation}
                            disabled={isProcessing}
                            className="w-full py-4 bg-[#EA1D2C] hover:bg-[#d1192a] text-white rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 active:scale-95"
                          >
                            {isProcessing ? "Processando..." : "Gerar Imagem"}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                          <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                            <ShieldCheck size={24} />
                          </div>
                          <h4 className="font-bold text-slate-800 mb-1">Efeito Concluído!</h4>
                          <p className="text-[10px] text-green-700 font-bold mb-6 uppercase tracking-wider">
                            Pronto para usar
                          </p>

                          <a 
                            href={resultUrl} 
                            download={`foto-ifood-45graus-estudiosabor.png`}
                            className="w-full py-4 bg-[#EA1D2C] hover:bg-[#d1192a] text-white rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 active:scale-95 mb-3"
                          >
                            <Download size={18} />
                            Baixar PNG
                          </a>

                          <button 
                            onClick={() => setResultUrl(null)}
                            className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-all"
                          >
                            Voltar para a prévia
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
