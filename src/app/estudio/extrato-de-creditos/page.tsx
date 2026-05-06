"use client";

import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Sparkles, History, Info, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashboardContext";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const mockTransactions = [
  { id: 1, type: "refill", amount: 50, date: "18 Abr 2026", title: "Pacote Parceiro Pro", description: "Via Mercado Pago (PIX)" },
  { id: 2, type: "usage", amount: 1, date: "18 Abr 2026", title: "Kit de Foto Gerado", description: "Template: Fim de Semana Prime" },
  { id: 3, type: "usage", amount: 1, date: "17 Abr 2026", title: "Kit de Foto Gerado", description: "Criação Livre #102" },
  { id: 4, type: "usage", amount: 1, date: "16 Abr 2026", title: "Kit de Foto Gerado", description: "Criação Livre #101" },
];

export default function BalancePage() {
  const { userCredits } = useDashboard();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsMock(false);
        const { data } = await supabase
          .from("credit_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        setTransactions(data || []);
      } else {
        setIsMock(true);
        setTransactions([]); // Clean for mock users
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const creditsSpent = transactions.filter((t) => t.type === "usage" || t.type === "generation").length;
  const creditsBought = transactions.filter((t) => t.type === "refill" || t.type === "purchase").reduce((acc, t) => acc + (t.amount || 0), 0);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center p-8 bg-[#F7F7F7] min-h-screen text-[#A6A6A6]">Carregando extrato...</div>;
  }

  return (
    <div className="flex-1 bg-brand-dark min-h-screen select-none overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12 pb-24 md:pb-12 space-y-12">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight font-display">
              Extrato de <span className="bg-clip-text text-transparent bg-brand-gradient">Créditos</span>
            </h1>
            <p className="text-white/40 font-medium mt-2">Controle total sobre seu investimento em marketing de cardápio.</p>
          </div>
          <Link
            href="/estudio/loja-de-creditos"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-gradient text-white text-sm font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
          >
            <ShoppingBag size={18} />
            Adquirir Créditos
          </Link>
        </div>

        {/* Balance Summary — Modern Dark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-surface border border-white/5 rounded-[32px] p-8 flex flex-col gap-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-brand-orange/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
              <Sparkles size={24} className="text-brand-orange" />
            </div>
            <div>
              <p className="text-4xl font-bold text-white tracking-tight font-display">{userCredits}</p>
              <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">Saldo Atual</p>
            </div>
          </div>

          <div className="bg-brand-surface border border-white/5 rounded-[32px] p-8 flex flex-col gap-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <ArrowDownLeft size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-4xl font-bold text-white tracking-tight font-display">+{creditsBought}</p>
              <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">Créditos Comprados</p>
            </div>
          </div>

          <div className="bg-brand-surface border border-white/5 rounded-[32px] p-8 flex flex-col gap-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-red-500/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <ArrowUpRight size={24} className="text-red-400" />
            </div>
            <div>
              <p className="text-4xl font-bold text-white tracking-tight font-display">{creditsSpent}</p>
              <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">Criações Realizadas</p>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
            <Info size={20} className="text-brand-yellow" />
          </div>
          <p className="text-sm text-white/60 leading-relaxed font-medium">
            <span className="text-white font-bold block mb-0.5">Como funciona:</span> 
            Cada crédito garante o uso de uma de nossas ferramentas premium de IA.
            Seus créditos nunca expiram — use quando quiser para impulsionar suas vendas.
          </p>
        </div>

        {/* Transaction Table */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-1">
            <div className="w-1 h-4 bg-brand-gradient rounded-full" />
            <h2 className="font-bold text-sm text-white uppercase tracking-widest font-display">Atividade Recente</h2>
          </div>

          <div className="bg-brand-surface border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
            {transactions.length > 0 ? (
              <>
                <div className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-8 py-6 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                          (tx.type === "refill" || tx.type === "purchase") 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-white/5 text-white/40 border-white/10"
                        )}>
                          {(tx.type === "refill" || tx.type === "purchase") ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                        </div>
                        <div>
                          <p className="text-base font-bold text-white font-display tracking-wide">{tx.description || tx.title || "Transação"}</p>
                          <p className="text-xs text-white/30 font-medium mt-0.5">{tx.date || new Date(tx.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={cn(
                          "font-mono font-bold text-lg tracking-tight",
                          (tx.type === "refill" || tx.type === "purchase") ? "text-emerald-400" : "text-white/60"
                        )}>
                          {(tx.type === "refill" || tx.type === "purchase") ? "+" : "-"}{tx.amount}
                          <span className="text-[10px] uppercase ml-1 opacity-40 font-sans tracking-widest">crédito{tx.amount > 1 ? "s" : ""}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5">
                  <p className="text-[10px] text-white/20 text-center font-bold uppercase tracking-[0.2em]">Fim do Histórico</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Clock size={32} className="text-white/20" />
                </div>
                <p className="text-xl font-bold text-white font-display">Sem atividade no momento</p>
                <p className="text-sm text-white/40 mt-2 max-w-[280px] font-medium leading-relaxed">
                  {isMock 
                    ? "Como você é um visitante, ainda não possui um histórico de créditos."
                    : "Você ainda não realizou nenhuma movimentação de créditos."
                  }
                </p>
                <Link 
                   href="/estudio" 
                   className="mt-10 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:border-brand-orange transition-all flex items-center gap-3"
                >
                  Começar a Criar <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
