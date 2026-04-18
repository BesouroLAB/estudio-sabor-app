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
      className="space-y-4"
    >
      {/* Filters */}
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-text-muted" />
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">
            Filtros
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="relative col-span-2 md:col-span-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="E-mail"
              value={usageEmail}
              onChange={(e) => setUsageEmail(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-input border border-border-default text-text-primary text-xs placeholder:text-text-muted focus:border-pepper-red/50 outline-none transition-all"
            />
          </div>
          <select
            value={usageType}
            onChange={(e) => setUsageType(e.target.value)}
            className="h-9 px-3 rounded-lg bg-bg-input border border-border-default text-text-primary text-xs outline-none"
          >
            <option value="">Todos os tipos</option>
            <option value="image_generation">Imagem</option>
            <option value="copywriting">Copywriting</option>
          </select>
          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="date"
              value={usageDateFrom}
              onChange={(e) => setUsageDateFrom(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-input border border-border-default text-text-primary text-xs outline-none"
            />
          </div>
          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="date"
              value={usageDateTo}
              onChange={(e) => setUsageDateTo(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-input border border-border-default text-text-primary text-xs outline-none"
            />
          </div>
          <button
            onClick={() => {
              setUsagePage(1);
              fetchUsage();
            }}
            className="h-9 px-4 rounded-lg bg-gradient-to-r from-pepper-red to-pepper-orange text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {["", "Data", "Usuário", "Tipo", "Modelo", "In", "Out", "USD", "BRL"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {usage.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border-subtle/50 hover:bg-bg-elevated/50 transition-colors"
                >
                  <td className="px-4 py-3">{statusBadge(row.status)}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">
                    {fmtDate(row.created_at)}
                  </td>
                  <td className="px-4 py-3 text-text-primary text-xs font-medium max-w-32 truncate">
                    {row.user_email || "—"}
                  </td>
                  <td className="px-4 py-3">{callTypeBadge(row.call_type)}</td>
                  <td className="px-4 py-3 text-text-muted text-[10px] font-mono">
                    {row.model}
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs font-mono">
                    {row.tokens_input.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs font-mono">
                    {row.tokens_output.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-green-400 text-xs font-mono">
                    ${fmt(Number(row.cost_usd), 4)}
                  </td>
                  <td className="px-4 py-3 text-pepper-orange text-xs font-bold font-mono">
                    R${fmt(Number(row.cost_brl))}
                  </td>
                </tr>
              ))}
              {usage.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-text-muted text-sm"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
            <span className="text-text-muted text-xs">
              {usageTotal} registros · Página {usagePage} de {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setUsagePage(Math.max(1, usagePage - 1))}
                disabled={usagePage <= 1}
                className="p-1.5 rounded-lg bg-bg-elevated border border-border-default text-text-muted hover:text-text-primary disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() =>
                  setUsagePage(Math.min(totalPages, usagePage + 1))
                }
                disabled={usagePage >= totalPages}
                className="p-1.5 rounded-lg bg-bg-elevated border border-border-default text-text-muted hover:text-text-primary disabled:opacity-30 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
