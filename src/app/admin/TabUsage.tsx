import { motion } from "framer-motion";
import { Search, Calendar, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import type { UsageRecord } from "./types";

interface UsageTabProps {
  usage: UsageRecord[];
  usageTotal: number;
  usagePage: number;
  setUsagePage: (p: number) => void;
  usageType: string;
  setUsageType: (t: string) => void;
  usageEmail: string;
  setUsageEmail: (e: string) => void;
  usageDateFrom: string;
  setUsageDateFrom: (d: string) => void;
  usageDateTo: string;
  setUsageDateTo: (d: string) => void;
  fetchUsage: () => void;
  fmt: (n: number, d?: number) => string;
  fmtDate: (s: string) => string;
  callTypeBadge: (t: string) => React.ReactNode;
  statusBadge: (s: string) => React.ReactNode;
}

export function UsageTab({
  usage,
  usageTotal,
  usagePage,
  setUsagePage,
  usageType,
  setUsageType,
  usageEmail,
  setUsageEmail,
  usageDateFrom,
  setUsageDateFrom,
  usageDateTo,
  setUsageDateTo,
  fetchUsage,
  fmt,
  fmtDate,
  callTypeBadge,
  statusBadge,
}: UsageTabProps) {
  const totalPages = Math.ceil(usageTotal / 50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Advanced Filter Panel */}
      <div className="bg-white border border-[#EAEAEC] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-red-50 text-[#EA1D2C]">
            <Filter size={16} />
          </div>
          <h3 className="text-sm font-bold text-[#3E3E3E] uppercase tracking-wider">
            Telemetria & Filtros
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6A6] group-focus-within:text-[#EA1D2C] transition-colors"
            />
            <input
              type="text"
              placeholder="Filtrar por e-mail..."
              value={usageEmail}
              onChange={(e) => setUsageEmail(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-sm text-[#3E3E3E] placeholder:text-[#A6A6A6] focus:border-[#EA1D2C]/50 focus:bg-white outline-none transition-all"
            />
          </div>
          
          <select
            value={usageType}
            onChange={(e) => setUsageType(e.target.value)}
            className="h-10 px-4 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-sm text-[#3E3E3E] outline-none focus:border-[#EA1D2C]/50 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="">Todos os tipos</option>
            <option value="image_generation">Imagem</option>
            <option value="copywriting">Copywriting</option>
          </select>

          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6A6] pointer-events-none"
            />
            <input
              type="date"
              value={usageDateFrom}
              onChange={(e) => setUsageDateFrom(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-xs text-[#3E3E3E] outline-none focus:border-[#EA1D2C]/50 focus:bg-white transition-all"
            />
          </div>

          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6A6] pointer-events-none"
            />
            <input
              type="date"
              value={usageDateTo}
              onChange={(e) => setUsageDateTo(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-xs text-[#3E3E3E] outline-none focus:border-[#EA1D2C]/50 focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={() => {
              setUsagePage(1);
              fetchUsage();
            }}
            className="h-10 w-full rounded-lg bg-[#EA1D2C] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#d1192a] active:scale-95 transition-all shadow-sm shadow-[#EA1D2C]/10"
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#EAEAEC] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#EAEAEC]">
                {["", "Horário", "Cliente", "Ação", "Modelo", "Tokens", "Custo USD", "BRL Total"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-[11px] font-bold text-[#717171] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F1F0]">
              {usage.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#FAFAFA] transition-colors group"
                >
                  <td className="px-6 py-4">{statusBadge(row.status)}</td>
                  <td className="px-6 py-4 text-[#A6A6A6] text-[11px] font-mono whitespace-nowrap">
                    {fmtDate(row.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#3E3E3E] text-xs font-bold truncate max-w-[150px] block">
                        {row.user_email || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{callTypeBadge(row.call_type)}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F7F7F7] text-[#717171] font-mono border border-[#EAEAEC] uppercase tracking-tighter">
                        {row.model}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#717171] text-[11px] font-mono">
                    <div className="flex flex-col">
                      <span>In: {row.input_tokens.toLocaleString()}</span>
                      <span>Out: {row.output_tokens.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-600 text-xs font-mono font-bold">
                        ${fmt(Number(row.cost_usd), 4)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#EA1D2C] text-xs font-bold font-mono">
                        R$ {fmt(Number(row.cost_brl))}
                    </span>
                  </td>
                </tr>
              ))}
              {usage.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="text-[#DDDDE0]" />
                        <p className="text-[#A6A6A6] text-xs font-bold uppercase tracking-widest">Nenhum registro encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#F7F7F7] border-t border-[#EAEAEC]">
            <span className="text-[#A6A6A6] text-[10px] font-bold uppercase tracking-widest">
              Total: {usageTotal} logs <span className="mx-2 text-[#EAEAEC]">|</span> Página {usagePage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setUsagePage(Math.max(1, usagePage - 1))}
                disabled={usagePage <= 1}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setUsagePage(Math.min(totalPages, usagePage + 1))
                }
                disabled={usagePage >= totalPages}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
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
