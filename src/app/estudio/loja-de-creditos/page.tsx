"use client";

import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Check, 
  Zap, 
  Target, 
  Rocket, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const pricingPackages = [
  {
    id: "emergencia",
    name: "Kit Essencial",
    credits: 10,
    price: "29,90",
    pricePerCredit: "2,99",
    description: "Ideal para testar a qualidade ou renovar pratos específicos.",
    icon: Zap,
    color: "bg-blue-50 text-blue-500 border-blue-100",
    features: ["10 Fotos Profissionais", "Legendas Sugeridas", "Download Imediato", "Uso Vitalício"]
  },
  {
    id: "agencia",
    name: "Combo Cardápio Completo",
    credits: 30,
    price: "59,90",
    pricePerCredit: "1,99",
    savings: "33%",
    description: "Sua agência de bolso para renovar todo o cardápio. O favorito dos restaurantes.",
    icon: Target,
    color: "bg-red-50 text-[#EA1D2C] border-red-100",
    popular: true,
    features: ["30 Fotos Profissionais", "Legendas de IA Avançada", "Todos os Templates", "Suporte Prioritário", "Economia Real de 33%"]
  },
  {
    id: "imperio",
    name: "Kit Dominação Local",
    credits: 100,
    price: "149,90",
    pricePerCredit: "1,49",
    savings: "50%",
    description: "Domine seu bairro com fotos profissionais e posts todos os dias.",
    icon: Rocket,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    features: ["100 Fotos Profissionais", "Legendas Ilimitadas", "Consultoria de Design", "Gerente de Conta", "Melhor Preço: R$ 1,49/foto"]
  }
];

function StorePageContent() {
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "failure") {
      alert("⚠️ Ocorreu um erro no pagamento. Por favor, tente novamente.");
      router.replace("/estudio/loja-de-creditos", { scroll: false });
    }
  }, [searchParams, router]);

  const handlePurchase = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar checkout');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Falha ao iniciar pagamento. Tente novamente.');
      setLoading(null);
    }
  };

  return (
    <div className="flex-1 bg-[#F7F7F7] min-h-screen select-none overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 pb-24 md:pb-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EAEAEC] text-[#717171] text-[11px] font-bold uppercase tracking-wider mx-auto shadow-sm">
              <ShoppingBag size={12} className="text-[#EA1D2C]" />
              Loja Oficial Estúdio Sabor
           </div>
           <h1 className="text-3xl font-bold text-[#3E3E3E] tracking-tight md:text-4xl">
              Transforme Cliques em <span className="text-[#EA1D2C]">Pedidos Reais</span>
           </h1>
           <p className="text-[#717171] text-sm leading-relaxed">
              Não deixe seu cliente "comer com os olhos" na concorrência. Adquira créditos e crie fotos profissionais que vendem por você, 24 horas por dia.
           </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {pricingPackages.map((pkg) => (
             <PackageCard 
               key={pkg.id} 
               pkg={pkg} 
               loading={loading === pkg.id}
               onSelect={() => handlePurchase(pkg.id)}
             />
           ))}
        </div>



        {/* Comparison Section (Neuromarketing) */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl">
          {/* Brand Aura Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EA1D2C]/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FF5C00]/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C] animate-ping" />
                Por que escolher o Estúdio & Sabor?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                O fim da dependência de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA1D2C] to-[#FF5C00]">
                  agências e fotógrafos.
                </span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-md">
                No modelo tradicional, você pagaria até R$ 500 por um kit e esperaria dias. 
                Aqui, você <span className="text-white font-medium">multiplica seu lucro no iFood</span> em segundos por menos de R$ 2,00 por foto.
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                {[
                  "Resultados instantâneos (30 segundos)",
                  "100% de aceitação no iFood garantida",
                  "Direitos autorais totais das imagens"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#EA1D2C] to-[#FF5C00] flex items-center justify-center p-0.5 shadow-lg shadow-[#EA1D2C]/20">
                      <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Outer Glow for the box */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#EA1D2C] to-[#FF5C00] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-[#111111] border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30 pb-4 border-b border-white/5">
                    <span>Comparativo</span>
                    <span>Custo Estimado</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400 text-sm">Fotógrafo Profissional (Kit 10)</span>
                    <span className="font-bold text-slate-500 line-through">R$ 450+</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400 text-sm">Agência Social Media</span>
                    <span className="font-bold text-slate-500 line-through">R$ 800+</span>
                  </div>
                  
                  <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-[#EA1D2C] to-[#FF5C00] relative overflow-hidden group shadow-2xl shadow-[#EA1D2C]/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-10 -translate-y-10" />
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-white">Estúdio & Sabor</span>
                        <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">IA Especializada</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-black text-white">R$ 29,90</span>
                        <span className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Acesso Imediato</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-white border border-[#EAEAEC] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex items-center justify-center shrink-0">
              <CreditCard className="text-[#3E3E3E]" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-[#3E3E3E]">Pagamento Flexível</h4>
              <p className="text-sm text-[#717171] mt-1">Aceitamos Pix, Cartão de Crédito e Mercado Pago. Liberação imediata dos créditos.</p>
            </div>
          </div>
          <div className="bg-white border border-[#EAEAEC] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex items-center justify-center shrink-0">
              <History className="text-[#3E3E3E]" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-[#3E3E3E]">Créditos Vitalícios</h4>
              <p className="text-sm text-[#717171] mt-1">Seus créditos não expiram nunca. Compre agora e use quando precisar renovar o cardápio.</p>
            </div>
          </div>
        </div>

        {/* Safety Footer */}
        <div className="flex flex-col items-center justify-center p-8 border-t border-[#EAEAEC] space-y-6">
           <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
              <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" alt="Mercado Pago" className="h-4" />
              <img src="https://logodownload.org/wp-content/uploads/2021/01/pix-logo-1.png" alt="Pix" className="h-4" />
           </div>
           <div className="flex items-center gap-2 text-[11px] text-[#A6A6A6] font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-500" />
              Ambiente Seguro via Mercado Pago
           </div>
        </div>

      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 bg-[#F7F7F7] min-h-screen">Carregando loja...</div>}>
      <StorePageContent />
    </Suspense>
  );
}

function PackageCard({ pkg, onSelect, loading }: any) {
  const Icon = pkg.icon;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn(
        "relative flex flex-col p-8 rounded-2xl bg-white border transition-all duration-300",
        pkg.popular 
          ? "border-[#EA1D2C]/30 shadow-xl shadow-[#EA1D2C]/5 ring-1 ring-[#EA1D2C]/10" 
          : "border-[#EAEAEC] hover:border-[#DDDDE0]"
      )}
    >
      {pkg.popular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-[#EA1D2C] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
           Mais Escolhido
        </div>
      )}

      {/* Package Header */}
      <div className="space-y-6">
        <div className={cn("inline-flex p-3 rounded-xl border", pkg.color)}>
           <Icon size={24} />
        </div>
        
        <div>
           <h3 className="text-xl font-bold text-[#3E3E3E] tracking-tight">
             {pkg.name}
           </h3>
           <p className="text-xs text-[#717171] mt-1.5 leading-relaxed">
             {pkg.description}
           </p>
        </div>

        <div className="flex flex-col gap-1">
           <div className="flex items-baseline gap-1">
              <span className="text-[#717171] text-sm font-medium">R$</span>
              <span className="text-4xl font-bold text-[#3E3E3E] tracking-tighter">
                {pkg.price}
              </span>
              <span className="text-[10px] text-[#A6A6A6] font-bold uppercase tracking-wider ml-1">
                / único
              </span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[11px] font-bold text-slate-400">
               R$ {pkg.pricePerCredit} por foto
             </span>
             {pkg.savings && (
               <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                 Economize {pkg.savings}
               </span>
             )}
           </div>
        </div>
      </div>

      {/* Features List */}
      <div className="my-8 flex-1 space-y-4">
         <p className="text-[10px] font-bold text-[#A6A6A6] uppercase tracking-wider border-b border-[#F3F1F0] pb-2">Incluso no kit:</p>
         {pkg.features.map((feature: string) => (
           <div key={feature} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#F7F7F7] flex items-center justify-center border border-[#EAEAEC]">
                 <Check size={10} className="text-[#EA1D2C]" />
              </div>
              <span className="text-sm text-[#3E3E3E]">{feature}</span>
           </div>
         ))}
      </div>

      {/* CTA */}
      <button 
        onClick={onSelect}
        disabled={loading}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm transition-all group active:scale-[0.98]",
          pkg.popular 
            ? "bg-[#EA1D2C] text-white hover:bg-[#d1192a] shadow-lg shadow-[#EA1D2C]/20" 
            : "bg-[#F7F7F7] text-[#3E3E3E] border border-[#EAEAEC] hover:bg-white hover:border-[#DDDDE0]"
        )}
      >
        {loading ? (
           <div className="w-5 h-5 border-2 border-[#A6A6A6] border-t-[#EA1D2C] rounded-full animate-spin" />
        ) : (
           <>
             COMPRAR {pkg.credits} CRÉDITOS
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </>
        )}
      </button>

      <p className="text-[10px] text-[#A6A6A6] text-center mt-4 font-medium italic">
        * Créditos válidos por tempo ilimitado.
      </p>
    </motion.div>
  );
}
