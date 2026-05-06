import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight, DollarSign, ArrowUpRight, ArrowDownLeft, ShieldCheck, Gift } from "lucide-react";
import type { Transaction } from "./types";
import { cn } from "@/lib/utils";

interface TransactionsTabProps {
  transactions: Transaction[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  type: string;
  setType: (t: string) => void;
  fetchTransactions: () => void;
  fmt: (n: number, d?: number) => string;
  fmtDate: (s: string) => string;
}

export function TransactionsTab({
  transactions,
  total,
  page,
  setPage,
  type,
  setType,
  fetchTransactions,
  fmt,
  fmtDate,
}: TransactionsTabProps) {
  const totalPages = Math.ceil(total / 50);

  const typeBadge = (t: Transaction["type"]) => {
    switch (t) {
      case "purchase":
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
            <DollarSign size={10} /> Compra
          </span>
        );
      case "usage":
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
            <Zap size={10} className="w-2.5 h-2.5" /> Uso
          </span>
        );
      case "admin_adjustment":
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck size={10} /> Ajuste
          </span>
        );
      case "onboarding_bonus":
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-bold uppercase tracking-wider">
            <Gift size={10} /> Bônus
          </span>
        );
      default:
        return t;
    }
  };

  const Zap = ({ size, className }: { size: number; className?: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="bg-white border border-[#EAEAEC] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Filter size={16} />
          </div>
          <h3 className="text-sm font-bold text-[#3E3E3E] uppercase tracking-wider">
            Filtros Financeiros
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-10 px-4 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-sm text-[#3E3E3E] outline-none focus:border-[#EA1D2C]/50 transition-all appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="">Todos os tipos</option>
            <option value="purchase">Compras</option>
            <option value="usage">Uso de Créditos</option>
            <option value="admin_adjustment">Ajustes Admin</option>
            <option value="onboarding_bonus">Bônus Iniciais</option>
          </select>

          <button
            onClick={() => {
              setPage(1);
              fetchTransactions();
            }}
            className="h-10 px-8 rounded-lg bg-[#EA1D2C] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#d1192a] active:scale-95 transition-all shadow-sm"
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EAEAEC] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#EAEAEC]">
                {["Data", "Cliente", "Tipo", "Créditos", "Pacote / Referência", "Tokens (I/O)", "Valor Pago"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-[11px] font-bold text-[#717171] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F1F0]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAFAFA] transition-colors group">
                  <td className="px-6 py-4 text-[#A6A6A6] text-[11px] font-mono whitespace-nowrap">
                    {fmtDate(tx.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#3E3E3E] text-xs font-bold block">
                      {tx.full_name || "—"}
                    </span>
                    <span className="text-[10px] text-[#A6A6A6] font-mono">
                      {tx.user_id.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">{typeBadge(tx.type)}</td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-bold font-mono",
                      tx.amount > 0 ? "text-emerald-600" : "text-[#EA1D2C]"
                    )}>
                      {tx.amount > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#717171] text-xs font-medium block">
                      {tx.package_name || "N/A"}
                    </span>
                    <span className="text-[10px] text-[#A6A6A6] font-mono">
                      Ref: {tx.reference_id || tx.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {tx.tokens_input !== undefined || tx.tokens_output !== undefined ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-[#3E3E3E] font-mono flex items-center gap-1">
                          <ArrowDownLeft size={10} className="text-blue-500" /> {tx.tokens_input || 0}
                        </span>
                        <span className="text-[10px] font-bold text-[#3E3E3E] font-mono flex items-center gap-1">
                          <ArrowUpRight size={10} className="text-emerald-500" /> {tx.tokens_output || 0}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#A6A6A6] text-[10px]">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {tx.amount_paid_brl > 0 ? (
                      <span className="text-[#3E3E3E] text-xs font-bold font-mono">
                        R$ {fmt(Number(tx.amount_paid_brl))}
                      </span>
                    ) : tx.cost_brl ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[#EA1D2C] text-[10px] font-bold font-mono uppercase tracking-tighter opacity-70">
                          Custo Operacional
                        </span>
                        <span className="text-[#3E3E3E] text-[11px] font-mono">
                          R$ {fmt(Number(tx.cost_brl), 4)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#A6A6A6] text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#F7F7F7] border-t border-[#EAEAEC]">
            <span className="text-[#A6A6A6] text-[10px] font-bold uppercase tracking-widest">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] disabled:opacity-40 transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] disabled:opacity-40 transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
