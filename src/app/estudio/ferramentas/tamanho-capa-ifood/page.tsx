"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ImageIcon, 
  Upload, 
  Download, 
  Crop, 
  CheckCircle2, 
  ShieldCheck, 
  Layout, 
  Star,
  Info,
  Maximize2
} from "lucide-react";
import Cropper from "react-easy-crop";

// --- Media Type Definitions ---
interface MediaOption {
  id: string;
  label: string;
  width: number;
  height: number;
  aspect: number;
  description: string;
  seoTag: string;
  tips: string[];
}

const MEDIA_OPTIONS: MediaOption[] = [
  {
    id: "capa",
    label: "Capa do Perfil",
    width: 1200, // High-res version of 430x300 (roughly 1.43:1, but 3:2 is 1200x800 which is the market standard)
    height: 837, // Adjusted for exact 430x300 proportion (430/300 = 1.433) -> 1200 / 1.433 = 837
    aspect: 430 / 300,
    description: "Imagem principal que aparece no cardápio e nas buscas.",
    seoTag: "Mais Cliques",
    tips: [
      "Use fotos 'Food Porn' com zoom no produto.",
      "Cores vibrantes ajudam a destacar no fundo branco.",
      "Evite textos pequenos ou logos sobrecarregados."
    ]
  },
  {
    id: "banner",
    label: "Banner da Loja",
    width: 1600,
    height: 368,
    aspect: 1600 / 368,
    description: "Fita retangular no topo da sua loja no iFood.",
    seoTag: "Profissionalismo",
    tips: [
      "Mantenha o conteúdo principal no centro (Safe Area).",
      "Ideal para mostrar o ambiente ou kit de produtos.",
      "No celular, as bordas laterais podem ser cortadas."
    ]
  },
  {
    id: "destaque",
    label: "Prato Destaque",
    width: 600, // High-res of 300x275
    height: 550,
    aspect: 300 / 275,
    description: "Usado em listas promocionais 'Hora do Almoço'.",
    seoTag: "Conversão",
    tips: [
      "Foto limpa, sem muitos elementos no fundo.",
      "Destaque bem o item principal do prato.",
      "Resolução mínima aceita: 300x275 px."
    ]
  }
];

// --- Helpers for cropping ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number },
  targetWidth: number,
  targetHeight: number
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (file) => {
        if (file) {
          resolve(URL.createObjectURL(file));
        } else {
          reject(new Error("Canvas is empty"));
        }
      },
      "image/jpeg",
      0.95
    );
  });
}

export default function IfoodMultiMediaToolPage() {
  const router = useRouter();

  // State
  const [selectedType, setSelectedType] = useState<MediaOption>(MEDIA_OPTIONS[0]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const showResult = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(
        imageSrc, 
        croppedAreaPixels, 
        selectedType.width, 
        selectedType.height
      );
      setResultUrl(croppedImage);
    } catch (e) {
      console.error(e);
      alert("Erro ao recortar a imagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setImageSrc(null);
    setResultUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark min-h-screen pb-20 text-white relative">
      {/* Brand Aura Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      {/* 
        ========================================================
        HEADER & BREADCRUMBS
        ========================================================
      */}
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
              <h1 className="text-4xl font-black text-white font-display tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-brand-red/20">
                  <Layout size={24} />
                </div>
                Ajuste de Mídia <span className="text-transparent bg-clip-text bg-brand-gradient">iFood Profissional</span>
              </h1>
              <p className="text-slate-400 mt-2 font-medium">Imagens nos tamanhos exatos para converter mais pedidos no iFood.</p>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-brand-dark border border-white/5 shadow-xl">
               <ShieldCheck size={18} className="text-emerald-500" />
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Padrão iFood 2024 Ativado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* 
            ========================================================
            LEFT COLUMN: TOOL SELECTION & OPTIONS
            ========================================================
          */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl pointer-events-none" />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Formato de Saída</h3>
              <div className="flex flex-col gap-4">
                {MEDIA_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedType(option);
                      setResultUrl(null);
                    }}
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left group ${
                      selectedType.id === option.id 
                        ? "border-brand-red/50 bg-brand-red/5 shadow-lg shadow-brand-red/5" 
                        : "border-white/5 bg-brand-dark/50 hover:bg-brand-dark hover:border-white/10"
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-all ${
                      selectedType.id === option.id 
                        ? "bg-brand-gradient text-white shadow-lg shadow-brand-red/20" 
                        : "bg-brand-surface text-slate-500 group-hover:text-slate-300"
                    }`}>
                      {option.id === "capa" && <ImageIcon size={20} />}
                      {option.id === "banner" && <Maximize2 size={20} />}
                      {option.id === "destaque" && <Star size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-sm uppercase tracking-tight ${selectedType.id === option.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>{option.label}</span>
                        <span className="text-[9px] px-2 py-0.5 bg-brand-dark border border-white/10 rounded font-black text-slate-500 tracking-tighter">
                          {option.width}x{option.height}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dicas Dinâmicas */}
            <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 text-brand-orange mb-6">
                <Info size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Checklist Pro</span>
              </div>
              <h4 className="text-xl font-black text-white mb-6 leading-tight">Sucesso no {selectedType.label}:</h4>
              <ul className="space-y-5">
                {selectedType.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-4 text-xs text-slate-400 font-medium leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 shadow-[0_0_10px_rgba(255,100,51,0.5)]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 
            ========================================================
            RIGHT COLUMN: EDITOR
            ========================================================
          */}
          <div className="lg:col-span-8">
            <div className="bg-brand-surface rounded-[40px] p-10 border border-white/5 shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[100px] pointer-events-none" />
              
              {!imageSrc ? (
                /* Empty State / Upload */
                <div className="flex-1 flex flex-col items-center justify-center py-20 relative z-10">
                  <div className="w-24 h-24 bg-brand-dark border border-white/5 text-slate-700 rounded-3xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                    <Upload size={48} className="text-slate-600" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3 text-center tracking-tight">Pronto para transformar sua vitrine?</h3>
                  <p className="text-slate-400 text-center max-w-sm mb-10 font-medium">
                    Arraste sua foto ou clique abaixo para iniciar o processo de redimensionamento profissional.
                  </p>
                  
                  <label className="px-10 py-5 bg-brand-gradient hover:scale-[1.03] active:scale-[0.97] text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-red/20 flex items-center gap-4 cursor-pointer">
                    <Upload size={20} />
                    Selecionar Imagem Original
                    <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
                  </label>
                  <p className="text-[10px] text-slate-500 mt-6 font-bold uppercase tracking-widest">JPG ou PNG • Máximo 10MB</p>
                </div>
              ) : (
                /* Editor State */
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                    <div>
                      <h3 className="font-black text-white text-xl tracking-tight">Editor de {selectedType.label}</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Arraste para ajustar o enquadramento</p>
                    </div>
                    <button 
                      onClick={resetAll}
                      className="text-[10px] font-black text-slate-500 hover:text-brand-red transition-colors uppercase tracking-[0.2em] px-4 py-2 bg-brand-dark rounded-xl border border-white/5"
                    >
                      Trocar Foto
                    </button>
                  </div>

                  <div className="flex-1 grid md:grid-cols-12 gap-10">
                    
                    {/* Cropper Container */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                      <div className={`relative w-full aspect-[4/3] bg-black rounded-[32px] overflow-hidden border border-white/5 shadow-2xl ${selectedType.id === 'banner' ? 'max-h-[350px]' : ''}`}>
                        {!resultUrl ? (
                          <>
                            <Cropper
                              image={imageSrc}
                              crop={crop}
                              zoom={zoom}
                              aspect={selectedType.aspect}
                              onCropChange={setCrop}
                              onCropComplete={onCropComplete}
                              onZoomChange={setZoom}
                              style={{
                                containerStyle: { background: '#000000' }
                              }}
                            />
                            {/* Visual Safe Area Helper for Banner */}
                            {selectedType.id === 'banner' && (
                              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="w-[60%] h-full border-x border-dashed border-white/20 flex items-center justify-center">
                                  <div className="bg-black/60 backdrop-blur-md text-[9px] text-white/80 px-3 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
                                    Safe Area (Mobile)
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-dark/50 backdrop-blur-sm p-6 relative group/final">
                            <img src={resultUrl} alt="Pronto" className="max-w-full max-h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl transition-transform duration-700 group-hover/final:scale-[1.02]" />
                            <div className="absolute top-4 left-4 bg-brand-red/90 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                              Preview Final
                            </div>
                          </div>
                        )}
                      </div>

                      {!resultUrl && (
                        <div className="bg-brand-dark border border-white/5 p-6 rounded-[24px] flex items-center gap-6 shadow-xl">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-16">Nível de Zoom</span>
                          <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-brand-red h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                          />
                          <span className="text-[10px] font-black text-brand-red bg-brand-red/10 px-3 py-1.5 rounded-lg border border-brand-red/20 min-w-[50px] text-center">
                            {zoom.toFixed(1)}x
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                      {!resultUrl ? (
                        <div className="bg-brand-dark/50 rounded-[32px] p-8 border border-white/5 flex-1 flex flex-col items-center justify-center text-center shadow-xl">
                          <div className="w-16 h-16 bg-brand-surface border border-white/5 text-brand-red rounded-[20px] flex items-center justify-center mb-6 shadow-2xl">
                            <Crop size={28} />
                          </div>
                          <h4 className="font-black text-white mb-3 text-lg tracking-tight">Processamento</h4>
                          <p className="text-[11px] text-slate-500 mb-8 leading-relaxed font-medium">
                            Ajuste o enquadramento desejado. Exportaremos em <strong>{selectedType.width}x{selectedType.height} px</strong> com compressão inteligente.
                          </p>
                          
                          <button
                            onClick={showResult}
                            disabled={isProcessing}
                            className="w-full py-5 bg-brand-gradient hover:scale-[1.02] active:scale-[0.98] text-white rounded-[18px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-red/20 flex justify-center items-center gap-3"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Processando...
                              </>
                            ) : (
                              <>
                                <Crop size={18} />
                                Gerar Mídia
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/5 rounded-[32px] p-8 border border-emerald-500/20 flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 shadow-2xl relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
                          
                          <div className="w-16 h-16 bg-emerald-500 text-white rounded-[20px] flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 size={32} />
                          </div>
                          <h4 className="font-black text-white mb-2 text-xl tracking-tight">Tudo pronto!</h4>
                          <p className="text-[10px] text-emerald-500 font-black mb-8 uppercase tracking-[0.2em] bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                            Alta Definição • iFood Ready
                          </p>
 
                          <a 
                            href={resultUrl} 
                            download={`ifood-${selectedType.id}-estudiosabor.jpg`}
                            className="w-full py-5 bg-brand-gradient hover:scale-[1.02] active:scale-[0.98] text-white rounded-[18px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-red/20 flex justify-center items-center gap-3 mb-4"
                          >
                            <Download size={20} />
                            Baixar Imagem
                          </a>
 
                          <button 
                            onClick={() => setResultUrl(null)}
                            className="w-full py-4 bg-brand-dark border border-white/5 hover:border-white/10 text-slate-400 hover:text-white rounded-[16px] font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                          >
                            Ajustar Enquadramento
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
