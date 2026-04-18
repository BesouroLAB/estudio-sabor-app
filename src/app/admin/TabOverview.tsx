import { motion } from "framer-motion";
import { Users, Zap, DollarSign, TrendingUp, Shield } from "lucide-react";
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
      label: "Usuários",
      value: stats.totalUsers,
      icon: <Users size={20} />,
      color: "text-pepper-orange",
      bg: "bg-pepper-orange/10",
      border: "border-pepper-orange/20",
    },
    {
      label: "Chamadas API",
      value: `${stats.totalCalls} (${stats.callsToday} hoje)`,
      icon: <Zap size={20} />,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
    {
      label: "Custo Total",
      value: `R$ ${fmt(stats.totalCostBrl)}`,
      sub: `US$ ${fmt(stats.totalCostUsd, 4)}`,
      icon: <DollarSign size={20} />,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: "Cotação USD",
      value: `R$ ${fmt(stats.exchangeRate, 4)}`,
      icon: <TrendingUp size={20} />,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} border ${card.border} rounded-2xl p-5 transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={card.color}>{card.icon}</span>
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">
                {card.label}
              </span>
            </div>
            <p className="text-text-primary font-display font-bold text-xl">
              {card.value}
            </p>
            {card.sub && (
              <p className="text-text-muted text-xs mt-1">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Calls by Type & Conversion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5">
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em] mb-4">
            Chamadas por Tipo
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.callsByType || {}).map(([type, count]) => {
              const total = stats.totalCalls || 1;
              const pct = Math.round((count / total) * 100);
              const isImage = type === "image_generation";
              return (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-text-secondary text-xs font-medium">
                      {isImage ? "🎨 Imagem" : "✍️ Copywriting"}
                    </span>
                    <span className="text-text-primary text-xs font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isImage
                          ? "bg-gradient-to-r from-pepper-red to-pepper-orange"
                          : "bg-gradient-to-r from-sky-500 to-sky-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.callsByType || {}).length === 0 && (
              <p className="text-text-muted text-xs">Nenhuma chamada ainda.</p>
            )}
          </div>
        </div>

        {/* Conversion/Download Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-surface border border-border-subtle p-6 rounded-2xl flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">
              Taxa de Download
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">
              {stats.downloadRate?.toFixed(1) || "0.0"}%
            </span>
            <span className="text-text-muted text-sm">conversão</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Eficiência dos presets de IA.
          </p>
        </motion.div>

        {/* Circuit Breaker / Budget Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-surface border border-border-subtle p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 ${stats.isSafeMode ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-lg`}>
              <Shield className={`w-5 h-5 ${stats.isSafeMode ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">
              Circuit Breaker (Hoje)
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">
              R$ {stats.spentToday?.toFixed(2) || "0.00"}
            </span>
            <span className="text-text-muted text-sm">/ R$ {stats.dailyBudget?.toFixed(2) || "30.00"}</span>
          </div>
          <div className="w-full bg-bg-elevated h-1.5 rounded-full mt-4">
            <div 
              className={`h-full rounded-full ${stats.spentToday && stats.spentToday > ((stats.dailyBudget || 30) * 0.8) ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(((stats.spentToday || 0) / (stats.dailyBudget || 30)) * 100, 100)}%` }}
            />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mini Chart - Daily Calls */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5">
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em] mb-4">
            Últimos 30 dias
          </h3>
          {stats.dailyCalls && stats.dailyCalls.length > 0 ? (
            <div className="flex items-end gap-0.5 h-32">
              {stats.dailyCalls.slice(-30).map((day) => {
                const total = day.image_generation + day.copywriting;
                const heightPct = maxDailyTotal > 0 ? (total / maxDailyTotal) * 100 : 0;
                const imgPct = total > 0 ? (day.image_generation / total) * 100 : 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col justify-end group relative"
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                      <div className="bg-bg-elevated border border-border-default rounded-lg px-2 py-1 text-[9px] text-text-secondary whitespace-nowrap shadow-lg">
                        <p className="font-bold text-text-primary">
                          {fmtShortDate(day.date)}
                        </p>
                        <p>🎨 {day.image_generation} · ✍️ {day.copywriting}</p>
                      </div>
                    </div>
                    <div
                      className="w-full rounded-t-sm overflow-hidden transition-all hover:opacity-80"
                      style={{ height: `${Math.max(heightPct, 2)}%` }}
                    >
                      <div
                        className="bg-gradient-to-t from-pepper-red to-pepper-orange"
                        style={{ height: `${imgPct}%` }}
                      />
                      <div
                        className="bg-sky-500"
                        style={{ height: `${100 - imgPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-text-muted text-xs">
              Sem dados ainda.
            </div>
          )}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-pepper-red to-pepper-orange" />
              <span className="text-text-muted text-[10px]">Imagem</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
              <span className="text-text-muted text-[10px]">Copy</span>
            </div>
          </div>
        </div>

        {/* Sync Exchange Button */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-8 h-8 text-text-muted mb-4" />
            <h3 className="text-text-primary font-bold mb-2">Sincronização Fiscal</h3>
            <p className="text-text-muted text-xs mb-6 max-w-xs">
                A cotação atual fixada no banco é de <strong>R$ {stats.exchangeRate?.toFixed(4) || "0.0000"}</strong>. 
                Clique abaixo para buscar a cotação mais recente na AwesomeAPI.
            </p>
            <button 
                onClick={syncExchange}
                className="px-6 py-2.5 rounded-xl bg-bg-elevated hover:bg-pepper-orange/10 text-pepper-orange border border-border-subtle hover:border-pepper-orange/30 transition-all font-semibold text-sm"
            >
                Sincronizar Câmbio Agora
            </button>
        </div>

      </div>
    </motion.div>
  );
}
