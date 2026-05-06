"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Type, Loader2, Copy, Check, Image as ImageIcon, Sparkles, X } from "lucide-react";
import { generateCopywriting } from "@/services/api";

export default function IfoodDescriptionGeneratorPage() {
  const router = useRouter();
  
  // State
  const [dishName, setDishName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [storeContext, setStoreContext] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ names?: string[], short: string; long: string } | null>(null);
  const [copied, setCopied] = useState<"short" | "long" | "names" | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsGenerating(true);
    try {
      const prompt = `
Contexto do Restaurante: ${storeContext || 'Restaurante/Delivery padrão'}
Ingredientes base: ${ingredients}
Nome do Prato: ${dishName || 'NENHUM NOME DEFINIDO'}
${imageSrc ? '[Uma imagem do prato foi enviada pelo usuário. Por favor, considere uma apresentação visual incrível.]' : ''}

AÇÃO:
1. Se o "Nome do Prato" for "NENHUM NOME DEFINIDO", crie 3 opções de nomes comerciais criativos e atrativos.
2. Crie uma descrição apetitosa para o cardápio do iFood (foco em conversão rápida e desejo).
3. Crie uma versão mais longa e envolvente para WhatsApp ou Feed do Instagram.
`;
      
      const response = await fetch('/api/replicate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'copywriting',
          food: dishName || ingredients.split(',')[0] || 'Prato',
          customContext: prompt
        })
      });

      if (!response.ok) throw new Error("Erro na geração");
      const data = await response.json();
      
      const generatedShort = data.output?.[0] || `O autêntico sabor que vai matar sua fome! Feito com ${ingredients}. Peça agora e receba quentinho. 🤤`;
      const generatedLong = data.output?.[1] || `Bateu aquela fome de respeito? Conheça nossa novidade feita com ${ingredients}, tudo com muito carinho para você. Ideal para qualquer momento do seu dia. Clique e faça seu pedido agora mesmo! 🚀`;
      
      // Simulação de nomes caso o prato não tenha nome (em um app real isso viria na resposta da IA dividida)
      const generatedNames = !dishName ? [
        "Supremo Sabor",
        "Especial da Casa",
        "Master " + (ingredients.split(' ')[0] || "Delícia")
      ] : undefined;

      setResult({
        names: generatedNames,
        short: generatedShort,
        long: generatedLong
      });

    } catch (error) {
      console.error(error);
      alert("Erro ao gerar descrição. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (type: "short" | "long" | "names", text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark min-h-screen text-white relative">
      {/* Brand Aura Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        <button
          onClick={() => router.push('/estudio')}
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao painel</span>
        </button>

        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-[0_10px_30px_rgba(234,29,44,0.3)] shrink-0">
            <Type size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white font-display tracking-tight leading-tight">
              Copiadora <span className="text-transparent bg-clip-text bg-brand-gradient">iFood Profissional</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Crie textos que dão água na boca e convertem visitantes em pedidos reais.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Formulário */}
          <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl pointer-events-none" />
            
            <form onSubmit={handleGenerate} className="flex flex-col gap-8">
              
              {/* Foto (Opcional) */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Visual do Prato (Opcional)</label>
                <div className="flex items-center gap-4">
                  {!imageSrc ? (
                    <label className="w-full border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-white/5 hover:border-brand-red/30 transition-all cursor-pointer group/upload">
                      <ImageIcon size={28} className="mb-3 group-hover/upload:text-brand-red transition-colors" />
                      <span className="text-[10px] font-bold text-center uppercase tracking-tight">Anexar foto para análise da IA</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  ) : (
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/10 group/preview">
                      <img src={imageSrc} className="w-full h-full object-cover transition-transform group-hover/preview:scale-110 duration-700" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => setImageSrc(null)}
                          className="bg-brand-red text-white p-3 rounded-xl hover:scale-110 transition-transform shadow-xl"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredientes */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">O que compõe o prato? *</label>
                <textarea
                  required
                  placeholder="Ex: Pão brioche amanteigado, blend 180g, queijo gouda, cebola caramelizada..."
                  className="w-full bg-brand-dark border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all min-h-[100px] resize-none font-medium placeholder:text-slate-700"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </div>

              {/* Contexto da Loja */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Personalidade da Loja (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Hamburgueria artesanal com pegada rústica"
                  className="w-full bg-brand-dark border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all font-medium placeholder:text-slate-700"
                  value={storeContext}
                  onChange={(e) => setStoreContext(e.target.value)}
                />
              </div>

              {/* Nome do Prato */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Prato</label>
                  <span className="text-[9px] bg-brand-red/10 text-brand-red px-2 py-1 rounded font-black uppercase tracking-wider border border-brand-red/20">A IA pode sugerir nomes</span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Gran Burger Especial"
                  className="w-full bg-brand-dark border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all font-medium placeholder:text-slate-700"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !ingredients.trim()}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center transition-all group/btn ${
                  isGenerating || !ingredients.trim()
                    ? "bg-brand-surface text-slate-600 border border-white/5 cursor-not-allowed"
                    : "bg-brand-gradient text-white hover:scale-[1.02] active:scale-[0.98] shadow-brand-red/20"
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-3"><Loader2 size={20} className="animate-spin" /> Cozinhando Textos...</span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Sparkles size={18} className="group-hover/btn:rotate-12 transition-transform" /> 
                    {dishName ? "Gerar Descrições" : "Criar Nome e Descrições"}
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Resultado */}
          <div className="flex flex-col gap-8 h-full">
            {!result ? (
              <div className="bg-brand-surface/30 border-2 border-white/5 border-dashed rounded-[32px] flex-1 min-h-[400px] flex flex-col items-center justify-center text-slate-600 p-12 text-center group">
                <div className="w-20 h-20 rounded-full bg-brand-surface border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={32} className="text-slate-700" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.2em] mb-2">Aguardando sua entrada</p>
                <p className="text-xs font-medium max-w-xs leading-relaxed">Preencha os dados do prato ao lado e deixe a IA criar uma vitrine irresistível para o seu delivery.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-8"
              >
                {/* Nomes Criados (se aplicável) */}
                {result.names && (
                  <div className="bg-brand-surface rounded-[32px] p-8 border border-brand-orange/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-3xl pointer-events-none" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange mb-6 flex items-center gap-2">
                      <Sparkles size={14}/> Sugestões de Nomes de Impacto
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {result.names.map((name, i) => (
                        <div key={i} className="bg-brand-dark border border-white/10 px-5 py-3 rounded-xl text-white font-black text-lg shadow-xl">
                          {name}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleCopy("names", result.names!.join('\n'))}
                      className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-brand-dark border border-white/10 text-slate-400 flex items-center justify-center hover:text-white transition-colors hover:border-brand-orange/50 shadow-xl"
                    >
                      {copied === "names" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                )}

                {/* Legenda Curta */}
                <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl pointer-events-none" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-6">Foco iFood (Máxima Conversão)</h3>
                  <div className="bg-brand-dark/50 border border-white/5 p-6 rounded-2xl">
                    <p className="text-slate-200 text-lg font-medium leading-relaxed italic">"{result.short}"</p>
                  </div>
                  
                  <button 
                    onClick={() => handleCopy("short", result.short)}
                    className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-brand-dark border border-white/10 text-slate-400 flex items-center justify-center hover:text-white transition-colors hover:border-brand-red/50 shadow-xl"
                  >
                    {copied === "short" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>

                {/* Legenda Longa */}
                <div className="bg-brand-surface rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl pointer-events-none" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange mb-6">WhatsApp & Redes Sociais</h3>
                  <div className="bg-brand-dark/50 border border-white/5 p-6 rounded-2xl">
                    <p className="text-slate-300 text-sm font-medium leading-relaxed whitespace-pre-wrap">{result.long}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleCopy("long", result.long)}
                    className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-brand-dark border border-white/10 text-slate-400 flex items-center justify-center hover:text-white transition-colors hover:border-brand-orange/50 shadow-xl"
                  >
                    {copied === "long" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

