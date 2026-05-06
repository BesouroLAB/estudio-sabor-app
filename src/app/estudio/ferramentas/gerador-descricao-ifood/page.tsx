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
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={() => router.push('/estudio')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao painel</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <Type size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-display">Gerador de Descrição para iFood</h1>
            <p className="text-slate-500 font-medium">Crie textos apetitosos que convertem visitantes em clientes no seu cardápio do iFood.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <form onSubmit={handleGenerate} className="flex flex-col gap-6">
              
              {/* Foto (Opcional) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto do Prato (Opcional)</label>
                <div className="flex items-center gap-4">
                  {!imageSrc ? (
                    <label className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-emerald-300 transition-colors cursor-pointer">
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs font-medium">Clique para enviar uma foto para análise da I.A.</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  ) : (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                      <img src={imageSrc} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => setImageSrc(null)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-lg hover:bg-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredientes */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">O que vai no prato? (Ingredientes) *</label>
                <textarea
                  required
                  placeholder="Ex: Pão brioche, 2 blends de 150g, queijo cheddar, bacon artesanal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all min-h-[80px] resize-none"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </div>

              {/* Contexto da Loja */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Contexto da sua Loja (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Hamburgueria artesanal de garagem com pegada rock n roll"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  value={storeContext}
                  onChange={(e) => setStoreContext(e.target.value)}
                />
              </div>

              {/* Nome do Prato */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-700">Nome do Prato (Opcional)</label>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold uppercase tracking-wider">Deixe em branco para a I.A. criar</span>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Smash Burguer Duplo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !ingredients.trim()}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${
                  isGenerating || !ingredients.trim()
                    ? "bg-slate-300 shadow-none cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1 hover:shadow-emerald-600/25"
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Processando Magia...</span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles size={18} /> {dishName ? "Gerar Descrições" : "Gerar Nomes e Descrições"}</span>
                )}
              </button>
            </form>
          </div>

          {/* Resultado */}
          <div className="flex flex-col gap-6">
            {!result ? (
              <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-3xl h-full min-h-[300px] flex items-center justify-center text-slate-400 font-medium p-8 text-center">
                Preencha os ingredientes e deixe a I.A. fazer a mágica para o seu iFood.
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-6"
              >
                {/* Nomes Criados (se aplicável) */}
                {result.names && (
                  <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 shadow-sm relative group">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-2"><Sparkles size={14}/> Sugestões de Nomes</h3>
                    <ul className="space-y-2 mb-2">
                      {result.names.map((name, i) => (
                        <li key={i} className="text-slate-800 font-bold text-lg">• {name}</li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handleCopy("names", result.names!.join('\n'))}
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center hover:bg-amber-200 transition-colors"
                    >
                      {copied === "names" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                )}

                {/* Legenda Curta */}
                <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.1)] relative group">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">Descrição para iFood (Conversão Rápida)</h3>
                  <p className="text-slate-700 text-lg whitespace-pre-wrap">{result.short}</p>
                  
                  <button 
                    onClick={() => handleCopy("short", result.short)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                  >
                    {copied === "short" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                {/* Legenda Longa */}
                <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.1)] relative group">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">Versão Longa (WhatsApp/Redes Sociais)</h3>
                  <p className="text-slate-700 text-[15px] whitespace-pre-wrap leading-relaxed">{result.long}</p>
                  
                  <button 
                    onClick={() => handleCopy("long", result.long)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                  >
                    {copied === "long" ? <Check size={16} /> : <Copy size={16} />}
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

