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

  const currentOption = useMemo(() => selectedType, [selectedType]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] min-h-screen pb-20">
      
      {/* 
        ========================================================
        HEADER & BREADCRUMBS
        ========================================================
      */}
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
                <Layout className="text-[#EA1D2C]" />
                Redimensionador de Imagens <span className="text-[#EA1D2C]">iFood</span>
              </h1>
              <p className="text-slate-500 mt-1">Crie imagens profissionais nos tamanhos exatos exigidos pelo iFood.</p>
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
          
          {/* 
            ========================================================
            LEFT COLUMN: TOOL SELECTION & OPTIONS
            ========================================================
          */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#EAEAEC] shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">O que você quer criar?</h3>
              <div className="flex flex-col gap-3">
                {MEDIA_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedType(option);
                      setResultUrl(null);
                    }}
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedType.id === option.id 
                        ? "border-[#EA1D2C] bg-red-50/30" 
                        : "border-slate-50 hover:border-slate-200 bg-white"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${selectedType.id === option.id ? "bg-[#EA1D2C] text-white" : "bg-slate-100 text-slate-400"}`}>
                      {option.id === "capa" && <ImageIcon size={20} />}
                      {option.id === "banner" && <Maximize2 size={20} />}
                      {option.id === "destaque" && <Star size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${selectedType.id === option.id ? "text-slate-900" : "text-slate-600"}`}>{option.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-400 font-mono">
                          {option.width}x{option.height}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dicas Dinâmicas */}
            <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
              <div className="flex items-center gap-2 text-[#EA1D2C] mb-4">
                <Info size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Dicas de Especialista</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-4">Como otimizar seu {selectedType.label}:</h4>
              <ul className="space-y-4">
                {selectedType.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EA1D2C] shrink-0" />
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
            <div className="bg-white rounded-3xl p-8 border border-[#EAEAEC] shadow-sm min-h-[500px] flex flex-col">
              
              {!imageSrc ? (
                /* Empty State / Upload */
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
                    <Upload size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Comece enviando sua foto</h3>
                  <p className="text-slate-500 text-center max-w-sm mb-8">
                    Selecione a melhor foto do seu prato ou restaurante. Nós cuidamos do enquadramento ideal para o iFood.
                  </p>
                  
                  <label className="px-8 py-4 bg-[#EA1D2C] hover:bg-[#d1192a] text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-3 cursor-pointer active:scale-95">
                    <Upload size={20} />
                    Selecionar Imagem do Computador
                    <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
                  </label>
                  <p className="text-xs text-slate-400 mt-4 italic">Formatos aceitos: JPG, PNG • Recomendado até 5MB</p>
                </div>
              ) : (
                /* Editor State */
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Ajuste seu {selectedType.label}</h3>
                      <p className="text-sm text-slate-500">Arraste para reposicionar e use o zoom para focar.</p>
                    </div>
                    <button 
                      onClick={resetAll}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Trocar Foto
                    </button>
                  </div>

                  <div className="flex-1 grid md:grid-cols-12 gap-8">
                    
                    {/* Cropper Container */}
                    <div className="md:col-span-8 flex flex-col gap-4">
                      <div className={`relative w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner ${selectedType.id === 'banner' ? 'max-h-[300px]' : ''}`}>
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
                                containerStyle: { background: '#0f172a' }
                              }}
                            />
                            {/* Visual Safe Area Helper for Banner */}
                            {selectedType.id === 'banner' && (
                              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="w-[60%] h-full border-x-2 border-dashed border-white/30 flex items-center justify-center">
                                  <span className="bg-black/50 text-[10px] text-white/70 px-2 py-1 rounded-full uppercase tracking-tighter">Área de Segurança (Mobile)</span>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 p-4">
                            <img src={resultUrl} alt="Pronto" className="max-w-full max-h-full shadow-2xl rounded-lg" />
                          </div>
                        )}
                      </div>

                      {!resultUrl && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                          <span className="text-sm font-bold text-slate-600 min-w-12">Zoom</span>
                          <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-[#EA1D2C]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                      {!resultUrl ? (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-1 flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 bg-white text-[#EA1D2C] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                            <Crop size={24} />
                          </div>
                          <h4 className="font-bold text-slate-800 mb-2">Finalizar Mídia</h4>
                          <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                            Vamos processar e exportar na resolução de <strong>{selectedType.width} x {selectedType.height} px</strong>.
                          </p>
                          
                          <button
                            onClick={showResult}
                            disabled={isProcessing}
                            className="w-full py-4 bg-[#EA1D2C] hover:bg-[#d1192a] text-white rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 active:scale-95"
                          >
                            {isProcessing ? "Processando..." : "Gerar Imagem"}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                          <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                            <CheckCircle2 size={24} />
                          </div>
                          <h4 className="font-bold text-slate-800 mb-1">Mídia Gerada!</h4>
                          <p className="text-[10px] text-green-700 font-bold mb-6 uppercase tracking-wider">
                            Otimizada para iFood
                          </p>

                          <a 
                            href={resultUrl} 
                            download={`ifood-${selectedType.id}-estudiosabor.jpg`}
                            className="w-full py-4 bg-[#EA1D2C] hover:bg-[#d1192a] text-white rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 active:scale-95 mb-3"
                          >
                            <Download size={18} />
                            Baixar Agora
                          </a>

                          <button 
                            onClick={() => setResultUrl(null)}
                            className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-all"
                          >
                            Ajustar novamente
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
