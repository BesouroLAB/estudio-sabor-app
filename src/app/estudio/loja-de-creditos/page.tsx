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
    color: "bg-brand-dark text-slate-400 border-white/5",
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
    color: "bg-brand-dark text-brand-red border-white/5",
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
    color: "bg-brand-dark text-emerald-500 border-white/5",
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
    <div className="flex-1 bg-brand-dark min-h-screen select-none overflow-y-auto relative text-white scrollbar-hide">
      {/* Brand Aura Glows — Deep Immersive Lighting */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.01] blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 pb-32 md:pb-16 space-y-24 relative z-10">
        
        {/* Header Section — Premium Conversion Copy */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-brand-surface border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mx-auto shadow-2xl"
           >
              <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              Estúdio Oficial de Créditos
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] font-display"
           >
              Seu Cardápio Precisa <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient">Vender Mais.</span>
           </motion.h1>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto font-medium tracking-tight"
           >
              O segredo das grandes redes não é a comida, é a <span className="text-white font-bold">foto.</span> Adquira créditos agora e transforme seu delivery em uma vitrine de elite.
           </motion.p>
        </div>

        {/* Pricing Grid — High-End Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
           {pricingPackages.map((pkg, index) => (
             <motion.div
               key={pkg.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 + index * 0.1 }}
             >
               <PackageCard 
                 pkg={pkg} 
                 loading={loading === pkg.id}
                 onSelect={() => handlePurchase(pkg.id)}
               />
             </motion.div>
           ))}
        </div>

        {/* Comparison Section (Neuromarketing) — High Contrast Premium */}
        <div className="bg-brand-surface border border-white/10 rounded-[48px] p-8 md:p-16 text-white overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
          {/* Internal Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-12 bg-brand-gradient" />
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.4em]">Por que nós?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] font-display">
                O fim da dependência de <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient">agências e fotógrafos.</span>
              </h2>
              
              <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
                No modelo tradicional, você pagaria caro e esperaria dias. 
                Aqui, você <span className="text-white font-bold">multiplica seu lucro no iFood</span> em segundos por menos de um cafezinho.
              </p>
              
              <div className="flex flex-col gap-5 pt-4">
                {[
                  "Resultados profissionais em 30 segundos",
                  "Aumento real na taxa de clique (CTR) no iFood",
                  "Liberdade total para criar e renovar seu cardápio"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-brand-dark border border-white/10 flex items-center justify-center p-0.5 shadow-lg group-hover:border-brand-red/50 transition-all">
                      <Check size={16} className="text-brand-red" />
                    </div>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              {/* Outer Glow for the box */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-brand-dark border border-white/10 rounded-3xl p-10 space-y-8 backdrop-blur-xl">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pb-6 border-b border-white/5">
                    <span>Comparativo de Mercado</span>
                    <span>Custo Médio</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 opacity-60">
                    <span className="text-slate-300 text-sm font-bold uppercase tracking-wider">Fotógrafo Profissional</span>
                    <span className="font-black text-slate-500 line-through">R$ 450+</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 opacity-60">
                    <span className="text-slate-300 text-sm font-bold uppercase tracking-wider">Agência Mensal</span>
                    <span className="font-black text-slate-500 line-through">R$ 800+</span>
                  </div>
                  
                  <div className="mt-8 p-8 rounded-[24px] bg-brand-gradient relative overflow-hidden group shadow-[0_30px_60px_rgba(234,29,44,0.3)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-10 -translate-y-10" />
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex flex-col">
                        <span className="font-black text-xl text-white tracking-tight">Estúdio & Sabor</span>
                        <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.2em]">IA Premium Food</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-4xl font-black text-white">R$ 29,90</span>
                        <span className="text-[10px] text-white/70 font-black uppercase tracking-wider">Acesso Vitalício</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="bg-brand-surface border border-white/10 rounded-3xl p-8 flex items-start gap-6 hover:border-brand-red/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-brand-dark border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xl">
              <CreditCard className="text-brand-orange" size={28} />
            </div>
            <div>
              <h4 className="font-black text-white text-lg uppercase tracking-tight">Pagamento Flexível</h4>
              <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Aceitamos Pix, Cartão e Mercado Pago. Seus créditos caem na conta em segundos após a confirmação.</p>
            </div>
          </div>
          <div className="bg-brand-surface border border-white/10 rounded-3xl p-8 flex items-start gap-6 hover:border-brand-red/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-brand-dark border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xl">
              <History className="text-brand-orange" size={28} />
            </div>
            <div>
              <h4 className="font-black text-white text-lg uppercase tracking-tight">Créditos Vitalícios</h4>
              <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Fique tranquilo: seus créditos nunca expiram. Compre agora com desconto e use conforme a sua necessidade.</p>
            </div>
          </div>
        </div>

        {/* Safety Footer — Dark Minimal */}
        <div className="flex flex-col items-center justify-center p-12 border-t border-white/5 space-y-8">
           <div className="flex items-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" alt="Mercado Pago" className="h-4 invert" />
              <img src="https://logodownload.org/wp-content/uploads/2021/01/pix-logo-1.png" alt="Pix" className="h-4" />
           </div>
           <div className="flex items-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
              <ShieldCheck size={16} className="text-emerald-500" />
              Ambiente Seguro via Mercado Pago
           </div>
        </div>

      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 bg-brand-dark min-h-screen text-white">Carregando loja...</div>}>
      <StorePageContent />
    </Suspense>
  );
}

function PackageCard({ pkg, onSelect, loading }: any) {
  const Icon = pkg.icon;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={cn(
        "relative flex flex-col p-8 md:p-10 rounded-[48px] bg-brand-surface border transition-all duration-500 flex-1 h-full overflow-hidden group",
        pkg.popular 
          ? "border-brand-red shadow-[0_20px_60px_rgba(234,29,44,0.15)] ring-1 ring-brand-red/20" 
          : "border-white/5 hover:border-brand-red/30 shadow-2xl"
      )}
    >
      {/* Background Glow for popular */}
      {pkg.popular && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/10 blur-[80px] pointer-events-none" />
      )}

      {pkg.popular && (
        <div className="absolute top-8 right-8 px-4 py-2 bg-brand-gradient text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/20 animate-pulse">
           O Mais Vendido
        </div>
      )}

      {/* Package Header */}
      <div className="space-y-8 relative z-10">
        <div className={cn(
          "inline-flex p-4 rounded-3xl border border-white/5 shadow-xl transition-transform duration-500 group-hover:scale-110", 
          pkg.popular ? "bg-brand-red/10 text-brand-red border-brand-red/20" : "bg-brand-dark text-brand-orange"
        )}>
           <Icon size={32} />
        </div>
        
        <div className="space-y-3">
           <h3 className="text-3xl font-black text-white tracking-tight font-display">
             {pkg.name}
           </h3>
           <p className="text-sm font-medium text-slate-400 leading-relaxed">
             {pkg.description}
           </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
           <div className="flex items-baseline gap-2">
              <span className="text-slate-400 text-xl font-bold">R$</span>
              <span className="text-6xl font-black text-white tracking-tighter font-display">
                {pkg.price}
              </span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">
               R$ {pkg.pricePerCredit} por foto
             </span>
             {pkg.savings && (
               <span className="px-2 py-1 rounded-lg bg-brand-gradient text-white text-[9px] font-black uppercase tracking-wider shadow-lg">
                 OFF {pkg.savings}
               </span>
             )}
           </div>
        </div>
      </div>

      {/* Features List */}
      <div className="my-10 flex-1 space-y-5 relative z-10">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] border-b border-white/5 pb-4">Incluso no pacote:</p>
         {pkg.features.map((feature: string) => (
           <div key={feature} className="flex items-center gap-4 group/item">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-brand-dark flex items-center justify-center border border-white/10 group-hover/item:border-brand-red/50 transition-colors shadow-lg">
                 <Check size={12} className="text-brand-red" />
              </div>
              <span className="text-sm font-bold text-slate-300 group-hover/item:text-white transition-colors">{feature}</span>
           </div>
         ))}
      </div>

      {/* CTA */}
      <button 
        onClick={onSelect}
        disabled={loading}
        className={cn(
          "flex items-center justify-center gap-3 w-full py-5 md:py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] relative overflow-hidden group/btn",
          pkg.popular 
            ? "bg-brand-gradient text-white shadow-[0_15px_30px_rgba(234,29,44,0.3)] hover:shadow-[0_20px_40px_rgba(234,29,44,0.4)]" 
            : "bg-white text-brand-dark hover:bg-slate-100 shadow-xl"
        )}
      >
        {loading ? (
           <div className="w-6 h-6 border-2 border-slate-400 border-t-brand-red rounded-full animate-spin" />
        ) : (
           <>
             Comprar {pkg.credits} Créditos
             <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
           </>
        )}
      </button>

      <p className="text-[10px] text-slate-600 text-center mt-6 font-black uppercase tracking-[0.3em]">
        Sem Mensalidade • Vitalício
      </p>
    </motion.div>
  );
}
