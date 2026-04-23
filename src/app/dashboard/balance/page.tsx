"use client";

import { motion } from "framer-motion";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingBag,
  Info,
  History
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const mockTransactions = [
  { id: 1, type: 'refill', amount: 50, date: '18 Abr 2026', title: 'Pacote Família - Recarga', description: 'Via Mercado Pago (PIX)' },
  { id: 2, type: 'usage', amount: 1, date: '18 Abr 2026', title: 'Geração de Kit', description: 'Template: Fim de Semana Prime' },
  { id: 3, type: 'usage', amount: 1, date: '17 Abr 2026', title: 'Geração de Kit', description: 'Criação Livre #102' },
  { id: 4, type: 'usage', amount: 1, date: '16 Abr 2026', title: 'Geração de Kit', description: 'Criação Livre #101' },
];

export default function BalancePage() {
  const credits = 30; // Mock current credits

  return (
    <div className="flex-1 px-[var(--space-page)] py-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">
               Extrato de <span className="text-pepper-orange">Créditos</span>
             </h1>
             <p className="text-text-muted text-sm capitalize">Controle total sobre seu investimento em marketing.</p>
          </div>
          
          <Link 
            href="/dashboard/store"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pepper-red text-white font-black rounded-xl hover:bg-pepper-red/90 transition-all shadow-xl shadow-pepper-red/15 active:scale-95"
          >
            <ShoppingBag size={18} />
            ADQUIRIR CRÉDITOS
          </Link>
        </div>

        {/* Balance Card Section */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-pepper-red to-pepper-orange overflow-hidden shadow-2xl shadow-pepper-red/20 text-white">
           {/* Decor */}
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                 <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Saldo Atual</span>
                 <p className="text-6xl font-display font-black tracking-tighter">
                   {credits} <span className="text-xl font-bold opacity-60 tracking-normal ml-1 lowercase">kits disponíveis</span>
                 </p>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 space-y-2">
                 <div className="flex items-center gap-2 text-xs font-bold">
                    <Info size={14} className="text-white/40" />
                    POR QUE USAR CRÉDITOS?
                 </div>
                 <p className="text-[10px] leading-relaxed max-w-[200px]">
                    Cada crédito garante 1 foto profissional + 1 legenda estratégica otimizada. Sem mensalidade fixa, pague apenas pelo que usar.
                 </p>
              </div>
           </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <History size={18} className="text-pepper-orange" />
              <h2 className="font-display font-bold text-xl text-text-primary">Atividade Recente</h2>
           </div>

           <div className="bg-bg-surface border border-border-default rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
             {mockTransactions.map((tx, idx) => (
               <div 
                 key={tx.id} 
                 className={`flex items-center justify-between p-5 hover:bg-bg-elevated transition-colors ${idx !== mockTransactions.length - 1 ? 'border-border-subtle' : ''} border-b`}
               >
                 <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      tx.type === 'refill' ? "bg-green-500/10 text-green-600" : "bg-pepper-red/10 text-pepper-red"
                    )}>
                       {tx.type === 'refill' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                       <h4 className="font-semibold text-text-primary text-sm">{tx.title}</h4>
                       <span className="text-xs text-text-muted">{tx.description}</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className={cn(
                      "font-mono font-bold text-sm",
                      tx.type === 'refill' ? "text-green-600" : "text-text-primary"
                    )}>
                       {tx.type === 'refill' ? '+' : '-'}{tx.amount}
                    </span>
                    <p className="text-[10px] text-text-muted mt-0.5">{tx.date}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
