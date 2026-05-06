import { motion } from "framer-motion";
import { Users, Zap, Shield, RefreshCw, Cpu, TrendingUp, Info } from "lucide-react";
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
      label: "Clientes ativos",
      value: stats.totalUsers || 0,
      sub: "Base total de usuários",
      icon: <Users size={16} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
      tooltip: "Total de estabelecimentos e usuários únicos que estão ativamente registrados e aptos a utilizar o Estúdio Sabor."
    },
    {
      label: "Custo API hoje",
      value: `R$ ${stats.spentToday?.toFixed(2) || "0.00"}`,
      sub: `Budget: R$ ${stats.dailyBudget || 30}`,
      icon: <Shield size={16} />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      tooltip: "Gasto acumulado hoje com serviços de Inteligência Artificial (OpenAI, fal.ai). Valor em dólares já convertido para reais com a cotação em tempo real."
    },
    {
      label: "Gerações hoje",
      value: stats.callsToday || 0,
      sub: "Imagens e copywriting",
      icon: <Cpu size={16} />,
      color: "text-[#EA1D2C]",
      bg: "bg-red-50",
      border: "border-red-100",
      tooltip: "Número absoluto de requisições enviadas e processadas com sucesso pelos motores de IA no dia de hoje."
    },
    {
      label: "Economia estimada",
      value: `R$ ${((stats.callsToday || 0) * 12.5).toFixed(0)}`,
      sub: "Baseado em custo manual",
      icon: <Zap size={16} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
      tooltip: "Cálculo de economia do negócio: Considera um custo operacional médio de R$ 12,50 (fotógrafo/redator) economizado para cada geração via IA realizada pelo sistema."
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Seção 1: KPIs Principais */}
      <div>
        <h2 className="text-sm font-bold text-[#3E3E3E] mb-4 tracking-tight">Indicadores Principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          // Lógica exclusiva para o Card de Clientes (Índice 0) virar uma Meta
          const isGoalCard = idx === 0;
          const userGoal = 50; // Meta realista de curto prazo
          const currentUsers = Number(card.value) || 0;
          const goalPct = Math.min((currentUsers / userGoal) * 100, 100);

          return (
            <div
              key={card.label}
              className="group relative bg-white border border-[#EAEAEC] rounded-xl p-5 hover:border-[#DDDDE0] transition-all cursor-help"
            >
              {/* Modal Hover Explicativo (Tooltip) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                <div className="bg-[#2D2D2D] text-white text-[11px] leading-relaxed p-3.5 rounded-xl shadow-2xl border border-white/10 relative">
                  <span className="font-bold block mb-1 text-[#EA1D2C]">{card.label}</span>
                  {card.tooltip}
                  {/* Seta direcional do tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-[#2D2D2D] border-t-[6px] border-x-transparent border-x-[6px] border-b-0" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${card.bg} ${card.color} ${card.border} border flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <span className="text-xs text-[#A6A6A6] font-medium">
                    {isGoalCard ? "Meta de Clientes" : card.label}
                  </span>
                </div>
                <Info size={14} className="text-[#D4D4D8] group-hover:text-[#A6A6A6] transition-colors" />
              </div>
              
              <p className="text-2xl font-bold text-[#3E3E3E] tracking-tight">
                {card.value}
              </p>
              
              {isGoalCard ? (
                <div className="mt-2.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-[#A6A6A6] font-medium">Progresso até {userGoal}</span>
                    <span className="text-[10px] text-blue-600 font-bold">{goalPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-blue-50/50 border border-blue-100/50 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${goalPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#717171] mt-1 font-medium">
                  {card.sub}
                </p>
              )}
            </div>
          );
        })}
      </div>
      </div>

      {/* Seção 2: Métricas Operacionais */}
      <div>
        <h2 className="text-sm font-bold text-[#3E3E3E] mb-4 tracking-tight">Métricas Operacionais</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Plan Distribution (Tiers) */}
        <div className="bg-white border border-[#EAEAEC] rounded-xl p-5">
          <h3 className="text-xs text-[#A6A6A6] font-medium mb-5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Distribuição de planos
          </h3>
          <div className="space-y-5">
            {Object.entries(stats.tiersDistribution || { "Free": 0, "Starter": 0, "Pro": 0 }).map(([tier, count]) => {
              const total = stats.totalUsers || 1;
              const pct = Math.round((Number(count) / total) * 100);
              const isFree = tier.toLowerCase().includes("free");
              return (
                <div key={tier}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm text-[#3E3E3E] font-semibold">
                        {tier}
                      </p>
                      <p className="text-[10px] text-[#A6A6A6] font-medium mt-0.5">
                        {count} usuários
                      </p>
                    </div>
                    <span className="text-sm text-[#3E3E3E] font-bold tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F3F1F0] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isFree ? "bg-[#A6A6A6]" : "bg-[#EA1D2C]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Usage Distribution */}
        <div className="bg-white border border-[#EAEAEC] rounded-xl p-5">
          <h3 className="text-xs text-[#A6A6A6] font-medium mb-5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EA1D2C]" />
            Distribuição de uso
          </h3>
          <div className="space-y-5">
            {Object.entries(stats.callsByType || {}).map(([type, count]) => {
              const total = stats.totalCalls || 1;
              const pct = Math.round((Number(count) / total) * 100);
              const isImage = type === "image_generation";
              return (
                <div key={type}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm text-[#3E3E3E] font-semibold">
                        {isImage ? "Gerador de Imagens" : "Criação de Copy"}
                      </p>
                      <p className="text-[10px] text-[#A6A6A6] font-medium mt-0.5">
                        {count} chamadas
                      </p>
                    </div>
                    <span className="text-sm text-[#3E3E3E] font-bold tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F3F1F0] rounded-full overflow-hidden">
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
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group relative bg-white border border-[#EAEAEC] rounded-xl p-5 flex flex-col justify-between cursor-help hover:border-[#DDDDE0] transition-all">
                {/* Modal Hover Explicativo (Tooltip) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                  <div className="bg-[#2D2D2D] text-white text-[11px] leading-relaxed p-3.5 rounded-xl shadow-2xl border border-white/10 relative">
                    <span className="font-bold block mb-1 text-[#EA1D2C]">Taxa de Conversão</span>
                    Mede o percentual de ativos de IA gerados que foram efetivamente baixados e salvos pelo usuário final. Valores altos (acima de 70%) indicam excelente assertividade da inteligência artificial.
                    {/* Seta direcional do tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-[#2D2D2D] border-t-[6px] border-x-transparent border-x-[6px] border-b-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
                          <TrendingUp size={16} className="text-purple-600" />
                      </div>
                      <span className="text-xs text-[#A6A6A6] font-medium">
                          Taxa de conversão
                      </span>
                  </div>
                  <Info size={14} className="text-[#D4D4D8] group-hover:text-[#A6A6A6] transition-colors" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#3E3E3E] tracking-tight">
                      {stats.downloadRate?.toFixed(1) || "0.0"}%
                  </p>
                  <p className="text-xs text-[#A6A6A6] mt-1 font-medium">
                      Download / Geração
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F3F1F0]">
                  {/* Lógica dinâmica de feedback */}
                  <span className={`text-[10px] font-semibold ${(stats.downloadRate || 0) >= 60 ? 'text-purple-500' : 'text-amber-500'}`}>
                    {(stats.downloadRate || 0) >= 60 ? 'Engajamento da Base: Alto' : 'Engajamento da Base: Em Atenção'}
                  </span>
                </div>
            </div>

            <div className="group relative bg-white border border-[#EAEAEC] rounded-xl p-5 flex flex-col justify-between cursor-help hover:border-[#DDDDE0] transition-all">
                {/* Modal Hover Explicativo (Tooltip) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                  <div className="bg-[#2D2D2D] text-white text-[11px] leading-relaxed p-3.5 rounded-xl shadow-2xl border border-white/10 relative">
                    <span className="font-bold block mb-1 text-[#EA1D2C]">Limite de Custos da API</span>
                    Orçamento máximo programado para o dia. Se o consumo chegar a 100%, o sistema suspende temporariamente a criação de IA para proteger a saúde financeira da empresa (Gatilho de Segurança).
                    {/* Seta direcional do tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-[#2D2D2D] border-t-[6px] border-x-transparent border-x-[6px] border-b-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${stats.spentToday && stats.spentToday > (stats.dailyBudget || 30) * 0.8 ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                          <Shield size={16} className={`${stats.spentToday && stats.spentToday > (stats.dailyBudget || 30) * 0.8 ? 'text-amber-600' : 'text-emerald-600'}`} />
                      </div>
                      <span className="text-xs text-[#A6A6A6] font-medium">
                          Limite de Custos (API)
                      </span>
                  </div>
                  <Info size={14} className="text-[#D4D4D8] group-hover:text-[#A6A6A6] transition-colors" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                      <p className="text-3xl font-bold text-[#3E3E3E] tracking-tight">
                          R$ {stats.spentToday?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-[#A6A6A6] font-medium">/ R$ {stats.dailyBudget?.toFixed(0) || "30"}</p>
                  </div>
                  <div className="w-full bg-[#F3F1F0] h-1.5 rounded-full mt-3 overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((stats.spentToday || 0) / (stats.dailyBudget || 30)) * 100, 100)}%` }}
                          className={`h-full rounded-full ${stats.spentToday && stats.spentToday > ((stats.dailyBudget || 30) * 0.8) ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F3F1F0]">
                  <span className="text-[10px] font-semibold text-emerald-500">Operacional</span>
                </div>
            </div>
        </div>
        </div>
      </div>

      {/* Seção 3: Análise e Status */}
      <div>
        <h2 className="text-sm font-bold text-[#3E3E3E] mb-4 tracking-tight">Monitoramento e Volume</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 bg-white border border-[#EAEAEC] rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs text-[#A6A6A6] font-medium flex items-center gap-2">
                <TrendingUp size={14} className="text-[#EA1D2C]" />
                Volume de operações · 30 dias
            </h3>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#EA1D2C]" />
                    <span className="text-[10px] text-[#717171] font-medium">Imagens</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-[#717171] font-medium">Copy</span>
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
                    <div className="bg-white border border-[#EAEAEC] rounded-lg px-2.5 py-1.5 shadow-lg min-w-[100px] text-center">
                        <p className="text-[10px] font-semibold text-[#3E3E3E] border-b border-[#F3F1F0] pb-1 mb-1">{fmtShortDate(day.date)}</p>
                        <p className="text-[10px] font-medium text-[#EA1D2C]">🎨 {day.image_generation}</p>
                        <p className="text-[10px] font-medium text-blue-500">✍️ {day.copywriting}</p>
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

        {/* Widget de Status do Sistema e Sync */}
        <div className="lg:col-span-1 bg-white border border-[#EAEAEC] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                 <h3 className="text-[#3E3E3E] font-semibold text-sm tracking-tight flex items-center gap-2">
                    <Shield size={14} className="text-emerald-500" />
                    Status do Sistema
                 </h3>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              </div>
              
              <div className="space-y-3.5 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#A6A6A6] font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Motores de IA
                  </span>
                  <span className="text-emerald-600 font-bold">Online</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#A6A6A6] font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Banco de Dados
                  </span>
                  <span className="text-emerald-600 font-bold">Estável</span>
                </div>
                
                <div className="pt-3.5 border-t border-[#F3F1F0] mt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#717171] font-medium">Cotação USD</span>
                    <span className="text-[#3E3E3E] font-bold bg-[#F7F7F7] px-2 py-0.5 rounded">
                      R$ {stats.exchangeRate?.toFixed(4) || "0.0000"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
                onClick={syncExchange}
                className="w-full py-2.5 rounded-lg bg-white border border-[#EAEAEC] shadow-sm text-[#717171] text-xs font-bold hover:bg-[#F7F7F7] hover:text-[#3E3E3E] hover:border-[#DDDDE0] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <RefreshCw size={14} />
                Sincronizar Câmbio
            </button>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
