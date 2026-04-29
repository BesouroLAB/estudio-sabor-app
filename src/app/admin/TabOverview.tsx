import { motion } from "framer-motion";
import { Users, Zap, Shield, RefreshCw, Cpu, TrendingUp } from "lucide-react";
import type { Stats } from "./types";

interface OverviewTabProps {
  stats: Stats | null;
  fmt: (n: number, d?: number) => string;
  fmtShortDate: (s: string) => string;
  maxDailyTotal: number;
  syncExchange: () => void;
}

export function OverviewTab({
  stats,
  fmt,
  fmtShortDate,
  maxDailyTotal,
  syncExchange,
}: OverviewTabProps) {
  if (!stats) return null;

  const cards = [
    {
      label: "Clientes Ativos",
      value: stats.totalUsers || 0,
      sub: "Base total de usuários",
      icon: <Users size={18} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Custo API (Hoje)",
      value: `R$ ${stats.spentToday?.toFixed(2) || "0.00"}`,
      sub: `Budget: R$ ${stats.dailyBudget || 30}`,
      icon: <Shield size={18} />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Gerações (Hoje)",
      value: stats.callsToday || 0,
      sub: "Imagens e Copywriting",
      icon: <Cpu size={18} />,
      color: "text-[#EA1D2C]",
      bg: "bg-red-50",
    },
    {
      label: "Economia Real",
      value: `R$ ${((stats.callsToday || 0) * 12.5).toFixed(0)}`,
      sub: "Baseado em custo manual",
      icon: <Zap size={18} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#EAEAEC] rounded-xl p-6 shadow-sm hover:border-[#DDDDE0] transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <span className="text-xs font-bold text-[#A6A6A6] uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#3E3E3E] tracking-tight">
                {card.value}
              </p>
              <p className="text-xs text-[#717171] mt-1 font-medium">
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Usage Distribution */}
        <div className="bg-white border border-[#EAEAEC] rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#3E3E3E] uppercase tracking-wider mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EA1D2C]" />
            Distribuição de Uso
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.callsByType || {}).map(([type, count]) => {
              const total = stats.totalCalls || 1;
              const pct = Math.round((count / total) * 100);
              const isImage = type === "image_generation";
              return (
                <div key={type}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[#3E3E3E] text-sm font-bold">
                        {isImage ? "Gerador de Imagens" : "Criação de Copy"}
                      </p>
                      <p className="text-[#A6A6A6] text-[10px] font-medium uppercase">
                        {count} chamadas
                      </p>
                    </div>
                    <span className="text-[#3E3E3E] text-lg font-bold">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F7F7F7] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isImage ? "bg-[#EA1D2C]" : "bg-blue-500"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion & Safety */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#EAEAEC] rounded-xl p-6 flex flex-col justify-between shadow-sm border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <TrendingUp size={18} className="text-purple-600" />
                    </div>
                    <h3 className="text-xs font-bold text-[#A6A6A6] uppercase tracking-wider">
                        Taxa de Conversão
                    </h3>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#3E3E3E] tracking-tighter">
                      {stats.downloadRate?.toFixed(1) || "0.0"}%
                  </p>
                  <p className="text-[10px] text-[#A6A6A6] mt-2 font-bold uppercase tracking-widest">
                      Download / Geração
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#F3F1F0]">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Feedback IA: Excelente</span>
                </div>
            </div>

            <div className="bg-white border border-[#EAEAEC] rounded-xl p-6 flex flex-col justify-between shadow-sm border-l-4 border-l-emerald-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${stats.spentToday && stats.spentToday > (stats.dailyBudget || 30) * 0.8 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                        <Shield size={18} className={`${stats.spentToday && stats.spentToday > (stats.dailyBudget || 30) * 0.8 ? 'text-amber-600' : 'text-emerald-600'}`} />
                    </div>
                    <h3 className="text-xs font-bold text-[#A6A6A6] uppercase tracking-wider">
                        Circuit Breaker
                    </h3>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold text-[#3E3E3E] tracking-tighter">
                          R$ {stats.spentToday?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-[#A6A6A6] font-bold">/ R$ {stats.dailyBudget?.toFixed(0) || "30"}</p>
                  </div>
                  <div className="w-full bg-[#F7F7F7] h-1.5 rounded-full mt-4 overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((stats.spentToday || 0) / (stats.dailyBudget || 30)) * 100, 100)}%` }}
                          className={`h-full rounded-full ${stats.spentToday && stats.spentToday > ((stats.dailyBudget || 30) * 0.8) ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#F3F1F0]">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Status: Operacional</span>
                </div>
            </div>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white border border-[#EAEAEC] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-[#3E3E3E] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={16} className="text-[#EA1D2C]" />
                Volume de Operações (30 Dias)
            </h3>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#EA1D2C]" />
                    <span className="text-[10px] font-bold text-[#717171] uppercase">Imagens</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold text-[#717171] uppercase">Copy</span>
                </div>
            </div>
          </div>
          
          <div className="flex items-end gap-1 h-40 px-2">
            {stats.dailyCalls?.slice(-30).map((day) => {
              const total = day.image_generation + day.copywriting;
              const heightPct = maxDailyTotal > 0 ? (total / maxDailyTotal) * 100 : 0;
              const imgPct = total > 0 ? (day.image_generation / total) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col justify-end group relative h-full">
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 pointer-events-none">
                    <div className="bg-white border border-[#EAEAEC] rounded-lg px-2 py-1.5 shadow-lg min-w-[100px] text-center">
                        <p className="text-[10px] font-bold text-[#3E3E3E] border-b border-[#F3F1F0] pb-1 mb-1">{fmtShortDate(day.date)}</p>
                        <p className="text-[10px] font-bold text-[#EA1D2C]">🎨 {day.image_generation}</p>
                        <p className="text-[10px] font-bold text-blue-500">✍️ {day.copywriting}</p>
                    </div>
                  </div>
                  <div
                    className="w-full rounded-t-sm overflow-hidden transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${Math.max(heightPct, 3)}%` }}
                  >
                    <div className="bg-[#EA1D2C]" style={{ height: `${imgPct}%` }} />
                    <div className="bg-blue-500" style={{ height: `${100 - imgPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border border-[#EAEAEC] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
                <RefreshCw size={24} className="text-[#EA1D2C]" />
            </div>
            <h3 className="text-[#3E3E3E] font-bold text-lg tracking-tight mb-1">Sync Fiscal</h3>
            <p className="text-[#A6A6A6] text-[10px] font-bold uppercase tracking-widest mb-6">
                Cotação: <span className="text-[#3E3E3E]">R$ {stats.exchangeRate?.toFixed(4) || "0.0000"}</span>
            </p>
            <button 
                onClick={syncExchange}
                className="w-full py-3 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-[#3E3E3E] text-xs font-bold uppercase tracking-widest hover:bg-[#EA1D2C] hover:text-white hover:border-[#EA1D2C] transition-all shadow-sm active:scale-95"
            >
                Sincronizar
            </button>
        </div>
      </div>
    </motion.div>
  );
}
