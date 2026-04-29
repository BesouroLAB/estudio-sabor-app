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
    name: "Kit Emergência",
    credits: 10,
    price: "29,90",
    description: "Ideal para renovar os pratos principais do seu cardápio.",
    icon: Zap,
    color: "bg-blue-50 text-blue-500 border-blue-100",
    features: ["10 Fotos Profissionais", "Legendas Sugeridas", "Download Imediato"]
  },
  {
    id: "agencia",
    name: "Kit Parceiro Pro",
    credits: 30,
    price: "59,90",
    description: "Sua agência de bolso para o mês. O mais escolhido.",
    icon: Target,
    color: "bg-red-50 text-[#EA1D2C] border-red-100",
    popular: true,
    features: ["30 Fotos Profissionais", "Legendas de IA Avançada", "Todos os Templates", "Suporte Prioritário"]
  },
  {
    id: "imperio",
    name: "Kit Dominação",
    credits: 100,
    price: "149,90",
    description: "Domine seu bairro com fotos profissionais todos os dias.",
    icon: Rocket,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    features: ["100 Fotos Profissionais", "Legendas Ilimitadas", "Consultoria de Cardápio", "Gerente de Conta"]
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
    <div className="flex-1 bg-[#F7F7F7] min-h-screen select-none overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 pb-24 md:pb-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EAEAEC] text-[#717171] text-[11px] font-bold uppercase tracking-wider mx-auto shadow-sm">
              <ShoppingBag size={12} className="text-[#EA1D2C]" />
              Loja Oficial Estúdio Sabor
           </div>
           <h1 className="text-3xl font-bold text-[#3E3E3E] tracking-tight md:text-4xl">
              Escolha seu <span className="text-[#EA1D2C]">Plano de Fotos</span>
           </h1>
           <p className="text-[#717171] text-sm">
              Adquira créditos e transforme seu cardápio em segundos. Fotos profissionais que aumentam as vendas do seu delivery.
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

        {/* Info Cards Section */}
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

        <div className="flex items-baseline gap-1">
           <span className="text-[#717171] text-sm font-medium">R$</span>
           <span className="text-4xl font-bold text-[#3E3E3E] tracking-tighter">
             {pkg.price}
           </span>
           <span className="text-[10px] text-[#A6A6A6] font-bold uppercase tracking-wider ml-1">
             / único
           </span>
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
