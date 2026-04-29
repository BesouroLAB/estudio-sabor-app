"use client";

import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Sparkles, History, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockTransactions = [
  { id: 1, type: "refill", amount: 50, date: "18 Abr 2026", title: "Pacote Parceiro Pro", description: "Via Mercado Pago (PIX)" },
  { id: 2, type: "usage", amount: 1, date: "18 Abr 2026", title: "Kit de Foto Gerado", description: "Template: Fim de Semana Prime" },
  { id: 3, type: "usage", amount: 1, date: "17 Abr 2026", title: "Kit de Foto Gerado", description: "Criação Livre #102" },
  { id: 4, type: "usage", amount: 1, date: "16 Abr 2026", title: "Kit de Foto Gerado", description: "Criação Livre #101" },
];

export default function BalancePage() {
  const credits = 30; // Mock — will be replaced by real data
  const creditsSpent = mockTransactions.filter((t) => t.type === "usage").length;
  const creditsBought = mockTransactions.filter((t) => t.type === "refill").reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex-1 bg-[#F7F7F7] min-h-screen select-none overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24 md:pb-8 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#3E3E3E] tracking-tight">
              Extrato de <span className="text-[#EA1D2C]">Créditos</span>
            </h1>
            <p className="text-sm text-[#717171] mt-1">Controle total sobre seu investimento em marketing de cardápio.</p>
          </div>
          <Link
            href="/dashboard/store"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#EA1D2C] text-white text-sm font-bold rounded-lg hover:bg-[#d1192a] transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag size={16} />
            Adquirir Créditos
          </Link>
        </div>

        {/* Balance Summary — iFood-style card row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#EAEAEC] rounded-xl p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Sparkles size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#3E3E3E] tracking-tight">{credits}</p>
              <p className="text-[11px] text-[#A6A6A6] font-medium uppercase tracking-wider mt-0.5">Saldo Atual</p>
            </div>
          </div>

          <div className="bg-white border border-[#EAEAEC] rounded-xl p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ArrowDownLeft size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#3E3E3E] tracking-tight">+{creditsBought}</p>
              <p className="text-[11px] text-[#A6A6A6] font-medium uppercase tracking-wider mt-0.5">Créditos Comprados</p>
            </div>
          </div>

          <div className="bg-white border border-[#EAEAEC] rounded-xl p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <ArrowUpRight size={20} className="text-[#EA1D2C]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#3E3E3E] tracking-tight">{creditsSpent}</p>
              <p className="text-[11px] text-[#A6A6A6] font-medium uppercase tracking-wider mt-0.5">Kits Gerados</p>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-[#3E3E3E] leading-relaxed">
            <span className="font-bold">Como funciona:</span> Cada crédito garante 1 foto profissional + 1 legenda estratégica.
            Seus créditos nunca expiram — use quando quiser.
          </p>
        </div>

        {/* Transaction Table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#717171]" />
            <h2 className="font-bold text-sm text-[#3E3E3E] uppercase tracking-wider">Atividade Recente</h2>
          </div>

          <div className="bg-white border border-[#EAEAEC] rounded-xl overflow-hidden">
            <div className="divide-y divide-[#F3F1F0]">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Left: Icon + Info */}
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      tx.type === "refill" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-[#EA1D2C]"
                    )}>
                      {tx.type === "refill" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#3E3E3E]">{tx.title}</p>
                      <p className="text-xs text-[#A6A6A6]">{tx.description}</p>
                    </div>
                  </div>

                  {/* Right: Amount + Date */}
                  <div className="text-right shrink-0">
                    <span className={cn(
                      "font-mono font-bold text-sm",
                      tx.type === "refill" ? "text-emerald-600" : "text-[#3E3E3E]"
                    )}>
                      {tx.type === "refill" ? "+" : "-"}{tx.amount} crédito{tx.amount > 1 ? "s" : ""}
                    </span>
                    <p className="text-[11px] text-[#A6A6A6] mt-0.5">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#F3F1F0]">
              <p className="text-xs text-[#A6A6A6] text-center">Mostrando os últimos {mockTransactions.length} movimentos</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
