"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Star, Diamond, Loader2, Check } from "lucide-react";

export interface PackageOption {
  id: string;
  name: string;
  credits: number;
  priceBRL: number;
  description: string;
  icon: typeof Rocket;
  color: string;
  popular?: boolean;
}

const packages: PackageOption[] = [
  {
    id: "emergencia",
    name: "Kit Emergência",
    credits: 10,
    priceBRL: 29.90,
    description: "Ideal para atualizar um cardápio pequeno (5 pratos + capas).",
    icon: Rocket,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "agencia",
    name: "Agência Digital",
    credits: 30,
    priceBRL: 59.90,
    description: "O mais vendido. Garante 1 Kit Semanal (Fotos + Copy) por semana.",
    icon: Star,
    color: "from-pepper-red to-pepper-orange",
    popular: true,
  },
  {
    id: "imperio",
    name: "Kit Império Pro",
    credits: 100,
    priceBRL: 149.90,
    description: "Para Dark Kitchens e postagens diárias em canais de alto tráfego.",
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
      alert(error.message || "Erro ao conectar com Mercado Pago. Tente novamente.");
      setLoadingPkg(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-[var(--space-page)]">
      <div className="w-full max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-8 focus-ring rounded-lg px-2 py-1 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao painel</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-3">
            Carregue seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-pepper-red to-pepper-orange">Diretor de Marketing</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Sem mensalidades surpresa. Você no controle. Adquira pacotes de créditos pré-pagos e utilize a inteligência do Estúdio Sabor apenas quando precisar.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className={`relative glass rounded-2xl p-6 flex flex-col border ${
                    pkg.popular ? "border-pepper-orange/50 shadow-[0_0_30px_rgba(255,87,34,0.1)]" : "border-border-subtle"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pepper-red to-pepper-orange rounded-full text-[10px] font-bold tracking-wider uppercase text-white shadow-lg">
                      O mais vendido
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${pkg.color} text-white shadow`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold">R$ {pkg.priceBRL.toFixed(2)}</span>
                  </div>

                  <p className="text-text-secondary text-sm mb-6 flex-1">
                    {pkg.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <Check size={12} />
                      </div>
                      <span><strong>{pkg.credits}</strong> Kits Semanais</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={loadingPkg !== null}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all focus-ring flex items-center justify-center ${
                      pkg.popular 
                        ? "bg-gradient-to-r from-pepper-red to-pepper-orange text-white hover:shadow-lg hover:shadow-pepper-orange/25 hover:brightness-110" 
                        : "bg-white text-black hover:bg-gray-100"
                    } ${loadingPkg === pkg.id ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loadingPkg === pkg.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Comprar Agora"
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
      </div>
    </div>
  );
}
