"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Star, Diamond, Loader2, Check, Zap, Crown } from "lucide-react";

export interface PackageOption {
  id: string;
  name: string;
  credits: number;
  priceBRL: number;
  description: string;
  icon: typeof Rocket;
  color: string;
  popular?: boolean;
  isSubscription?: boolean;
}

const subscriptionPlan: PackageOption = {
  id: "assinatura_pro",
  name: "Estúdio Premium PRO",
  credits: 60,
  priceBRL: 49.90,
  description: "Acesso total à Inteligência Artificial do Estúdio & Sabor. Receba 60 créditos todo mês para gerar seus conteúdos.",
  icon: Crown,
  color: "from-amber-400 to-amber-600",
  isSubscription: true,
};

const packages: PackageOption[] = [
  {
    id: "emergencia",
    name: "Kit Emergência",
    credits: 10,
    priceBRL: 29.90,
    description: "Ideal para testar ou atualizar um cardápio pequeno.",
    icon: Rocket,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "agencia",
    name: "Agência Digital",
    credits: 30,
    priceBRL: 59.90,
    description: "O mais vendido entre pacotes avulsos. Bom volume.",
    icon: Star,
    color: "from-emerald-500 to-teal-600",
    popular: true,
  },
  {
    id: "imperio",
    name: "Império Dark Kitchen",
    credits: 100,
    priceBRL: 149.90,
    description: "Para uso intenso e postagens diárias em canais de tráfego.",
    icon: Diamond,
    color: "from-purple-500 to-fuchsia-600",
  },
];

interface StoreViewProps {
  onBack: () => void;
  userId: string;
}

export function StoreView({ onBack, userId }: StoreViewProps) {
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);

  const handlePurchase = async (pkg: PackageOption) => {
    if (userId === "mock-temporario") {
      alert("Você está no Modo Demonstração. Para realizar uma compra real, por favor, faça login ou crie uma conta.");
      return;
    }
    setLoadingPkg(pkg.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar checkout");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "Erro ao conectar com Mercado Pago. Tente novamente.";
      alert(errorMessage);
      setLoadingPkg(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-[var(--space-page)] overflow-y-auto w-full">
      <div className="w-full max-w-5xl pb-24">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-8 focus-ring rounded-lg px-2 py-1 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao painel</span>
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
            Evolua para o <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">Premium</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Libere as ferramentas de Inteligência Artificial e multiplique as vendas do seu restaurante.
          </p>
        </div>

        {/* ========================================= */}
        {/* ASSINATURA PRO (HERO)                     */}
        {/* ========================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass rounded-3xl p-1 mb-16 bg-gradient-to-br from-amber-200 via-amber-100 to-amber-50 shadow-[0_0_40px_-10px_rgba(251,191,36,0.3)]"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[1.4rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                  <Crown size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Estúdio PRO</h2>
              </div>
              <p className="text-slate-600 text-lg mb-6 max-w-md">
                O melhor custo-benefício. Receba <strong className="text-amber-600">60 Créditos</strong> todo mês para criar Kits, Posts e aprimorar pratos.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {["Acesso à I.A. Fotográfica", "Geração de Textos Copy", "Recarga mensal automática", "Sem Fidelidade, cancele quando quiser"].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-[320px] bg-white rounded-2xl p-6 shadow-xl border border-amber-100 text-center shrink-0">
              <div className="text-amber-600 font-bold tracking-widest text-sm uppercase mb-2">Assinatura Mensal</div>
              <div className="flex justify-center items-end gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">R$ 49,90</span>
                <span className="text-slate-500 font-medium mb-1">/mês</span>
              </div>
              
              <button
                onClick={() => handlePurchase(subscriptionPlan)}
                disabled={loadingPkg !== null}
                className={`w-full py-4 px-4 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg shadow-amber-500/25 ${
                  loadingPkg === subscriptionPlan.id ? "opacity-70 cursor-not-allowed bg-amber-500 text-white" : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:brightness-110 hover:-translate-y-1"
                }`}
              >
                {loadingPkg === subscriptionPlan.id ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">Assinar Agora <Zap size={18} className="fill-white" /></span>
                )}
              </button>
              <p className="text-xs text-slate-400 mt-4 font-medium">Pagamento seguro processado via Mercado Pago.</p>
            </div>
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* PACOTES AVULSOS                           */}
        {/* ========================================= */}
        <div className="mt-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Precisa apenas de uma recarga avulsa?</h3>
            <p className="text-slate-500 text-sm mt-1">Créditos que não expiram, sem compromisso mensal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`relative glass rounded-2xl p-6 flex flex-col border bg-white ${
                    pkg.popular ? "border-emerald-300 shadow-xl shadow-emerald-500/10" : "border-slate-200"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 rounded-full text-[10px] font-bold tracking-wider uppercase text-white shadow-lg">
                      O mais vendido
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br ${pkg.color} text-white shadow`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-slate-900">R$ {pkg.priceBRL.toFixed(2)}</span>
                  </div>

                  <p className="text-slate-500 text-sm mb-6 flex-1">
                    {pkg.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Zap size={16} className="text-amber-500 fill-amber-500" />
                      <span><strong>{pkg.credits}</strong> Créditos</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={loadingPkg !== null}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all focus-ring flex items-center justify-center border-2 ${
                      pkg.popular 
                        ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600" 
                        : "bg-transparent border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    } ${loadingPkg === pkg.id ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loadingPkg === pkg.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Comprar Pacote"
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
