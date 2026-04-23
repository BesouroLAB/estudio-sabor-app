"use client";

import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Check, 
  Zap, 
  Target, 
  Rocket, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const pricingPackages = [
  {
    id: "emergencia",
    name: "Kit Emergência",
    credits: 10,
    price: "29,90",
    description: "Para quem precisa de um fôlego rápido no cardápio.",
    icon: Zap,
    color: "from-blue-500/10 to-blue-400/5",
    accent: "text-blue-400",
    features: ["10 Fotos Profissionais", "Legendas de IA", "Ideal p/ Onboarding"]
  },
  {
    id: "agencia",
    name: "Kit Agência Digital",
    credits: 30,
    price: "59,90",
    description: "Sua agência de bolso para o mês inteiro. O favorito.",
    icon: Target,
    color: "from-pepper-red/20 to-pepper-orange/10",
    accent: "text-pepper-orange",
    popular: true,
    features: ["30 Fotos Profissionais", "Legendas de IA Pro", "Acesso Total Templates", "Missões Semanais"]
  },
  {
    id: "imperio",
    name: "Kit Império / Pro",
    credits: 100,
    price: "149,90",
    description: "Domine seu bairro com conteúdo diário e profissional.",
    icon: Rocket,
    color: "from-purple-500/10 to-pink-500/5",
    accent: "text-purple-400",
    features: ["100 Fotos Profissionais", "WhatsApp Express", "Consultoria de Dados", "Suporte VIP"]
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
      router.replace("/dashboard/store", { scroll: false });
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
    <div className="flex-1 px-[var(--space-page)] py-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pepper-orange/10 border border-pepper-orange/20 text-pepper-orange text-[10px] font-bold uppercase tracking-widest mx-auto">
              <ShoppingBag size={12} />
              Loja Oficial Estúdio Sabor
           </div>
           <h1 className="font-display font-bold text-4xl text-text-primary tracking-tight md:text-5xl">
              Escolha seu <span className="text-pepper-orange">Plano de Ataque</span>
           </h1>
           <p className="text-text-muted max-w-xl mx-auto">
              Adquira créditos e pare de depender de agências caras. Design profissional a um toque de distância.
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

        {/* Safety Footer */}
        <div className="flex flex-col items-center justify-center p-8 border-t border-border-subtle space-y-4">
           <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
              <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" alt="Mercado Pago" className="h-4" />
              <img src="https://logodownload.org/wp-content/uploads/2021/01/pix-logo-1.png" alt="Pix" className="h-4" />
           </div>
           <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-green-600" />
              Pagamento 100% Seguro via Mercado Pago
           </div>
        </div>

      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8">Carregando loja...</div>}>
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
        "relative flex flex-col p-8 rounded-[2.5rem] bg-bg-surface border transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.02)]",
        pkg.popular 
          ? "border-pepper-orange/30 shadow-2xl shadow-pepper-orange/5 scale-105 z-10" 
          : "border-border-default hover:border-pepper-orange/20"
      )}
    >
      {pkg.popular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 bg-pepper-orange text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
           Mais Recomendado
        </div>
      )}

      {/* Package Header */}
      <div className="space-y-6">
        <div className={cn("inline-flex p-3 rounded-2xl bg-gradient-to-br", pkg.color)}>
           <Icon size={24} className={pkg.accent} />
        </div>
        
        <div>
           <h3 className="font-display font-bold text-2xl text-text-primary tracking-tight">
             {pkg.name}
           </h3>
           <p className="text-xs text-text-muted mt-1 leading-relaxed">
             {pkg.description}
           </p>
        </div>

        <div className="flex items-baseline gap-1">
           <span className="text-text-muted text-lg font-medium">R$</span>
           <span className="text-5xl font-display font-black text-text-primary tracking-tighter">
             {pkg.price}
           </span>
           <span className="text-xs text-text-muted font-bold uppercase tracking-widest ml-1 opacity-50">
             / Único
           </span>
        </div>
      </div>

      {/* Features List */}
      <div className="my-8 flex-1 space-y-4">
         <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle pb-2">O que está incluso:</p>
         {pkg.features.map((feature: string) => (
           <div key={feature} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center">
                 <Check size={8} className={pkg.accent} />
              </div>
              <span className="text-sm text-text-secondary">{feature}</span>
           </div>
         ))}
      </div>

      {/* CTA */}
      <button 
        onClick={onSelect}
        disabled={loading}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-sm transition-all group",
          pkg.popular 
            ? "bg-pepper-orange text-white shadow-xl shadow-pepper-orange/20 hover:bg-pepper-red" 
            : "bg-bg-elevated text-text-primary border border-border-default hover:bg-bg-surface"
        )}
      >
        {loading ? (
           <div className="w-5 h-5 border-2 border-text-muted border-t-pepper-orange rounded-full animate-spin" />
        ) : (
           <>
             GARANTIR {pkg.credits} CRÉDITOS
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </>
        )}
      </button>

      <p className="text-[10px] text-text-muted text-center mt-4">
        Créditos que não expiram. Use quando quiser.
      </p>
    </motion.div>
  );
}
