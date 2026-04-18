"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Users, Zap, TrendingUp, Image as ImageIcon, Type,
  RefreshCw, LogOut, Shield
} from "lucide-react";

import { Tab, Stats, UserProfile, UsageRecord } from "./types";
import { OverviewTab } from "./TabOverview";
import { UsageTab } from "./TabUsage";
import { CRMTab } from "./TabCRM";

// --- Component ---
export default function AdminDashboard({
  userEmail,
}: {
  userEmail: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [usageTotal, setUsageTotal] = useState(0);

  // Filters
  const [userSearch, setUserSearch] = useState("");
  const [usageEmail, setUsageEmail] = useState("");
  const [usageType, setUsageType] = useState("");
  const [usageDateFrom, setUsageDateFrom] = useState("");
  const [usageDateTo, setUsageDateTo] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usagePage, setUsagePage] = useState(1);

  const [loading, setLoading] = useState(true);

  // --- Fetch Functions ---
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error("Stats fetch failed:", e);
    }
  }, []);

  const syncExchange = async () => {
    try {
      const res = await fetch("/api/admin/exchange/sync");
      if (res.ok) {
        alert("Câmbio sincronizado com sucesso!");
        fetchStats();
      }
    } catch (e) {
      alert("Falha ao sincronizar câmbio.");
    }
  };

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(usersPage),
      limit: "20",
    });
  if (userSearch) params.set("search", userSearch);
  try {
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setUsersTotal(data.total);
    }
  } catch (e) {
    console.error("Users fetch failed:", e);
  }
}, [usersPage, userSearch]);

const fetchUsage = useCallback(async () => {
  const params = new URLSearchParams({
    page: String(usagePage),
    limit: "50",
  });
  if (usageType) params.set("callType", usageType);
  if (usageEmail) params.set("userEmail", usageEmail);
  if (usageDateFrom) params.set("dateFrom", usageDateFrom);
  if (usageDateTo) params.set("dateTo", usageDateTo);
  try {
    const res = await fetch(`/api/admin/usage?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsage(data.usage);
      setUsageTotal(data.total);
    }
  } catch (e) {
    console.error("Usage fetch failed:", e);
  }
}, [usagePage, usageType, usageEmail, usageDateFrom, usageDateTo]);

// --- Initial Load ---
useEffect(() => {
  setLoading(true);
  Promise.all([fetchStats(), fetchUsers(), fetchUsage()]).finally(() =>
    setLoading(false)
  );
}, [fetchStats, fetchUsers, fetchUsage]);

// --- Tab Config ---
const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Painel", icon: <TrendingUp size={16} /> },
  { id: "usage", label: "Histórico", icon: <Zap size={16} /> },
  { id: "crm", label: "Clientes", icon: <Users size={16} /> },
];

// --- Helpers ---
const fmt = (n: number, decimals = 2) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

const callTypeBadge = (type: string) => {
  const isImage = type === "image_generation";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isImage
          ? "bg-pepper-orange/10 text-pepper-orange border border-pepper-orange/20"
          : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
        }`}
    >
      {isImage ? <ImageIcon size={10} /> : <Type size={10} />}
      {isImage ? "Imagem" : "Copy"}
    </span>
  );
};

const statusBadge = (status: string) => (
  <span
    className={`inline-block w-2 h-2 rounded-full ${status === "success" ? "bg-green-500" : "bg-pepper-red"
      }`}
  />
);

// --- Chart ---
const maxDailyTotal = stats?.dailyCalls
  ? Math.max(
    ...stats.dailyCalls.map(
      (d) => d.image_generation + d.copywriting
    ),
    1
  )
  : 1;

return (
  <div className="min-h-dvh bg-bg-base">
    {/* Header */}
    <header className="sticky top-0 z-50 glass border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-[var(--space-page)] h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pepper-red to-pepper-orange flex items-center justify-center">
            <Flame size={18} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-text-primary">
              Admin
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pepper-red/10 border border-pepper-red/20">
              <Shield size={10} className="text-pepper-red" />
              <span className="text-pepper-red text-[10px] font-bold uppercase tracking-wider">
                Owner
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-text-muted text-xs hidden sm:block">
            {userEmail}
          </span>
          <button
            onClick={() => fetchStats()}
            className="w-7 h-7 rounded-lg bg-bg-elevated border border-border-default flex items-center justify-center text-text-muted hover:text-pepper-orange transition-all"
            title="Atualizar dados"
          >
            <RefreshCw size={14} />
          </button>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-7 h-7 rounded-lg bg-bg-elevated border border-border-default flex items-center justify-center text-text-muted hover:text-pepper-red transition-all"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>
    </header>

    {/* Tabs */}
    <div className="max-w-7xl mx-auto px-[var(--space-page)] pt-6">
      <div className="flex gap-1 bg-bg-surface rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                ? "bg-gradient-to-r from-pepper-red to-pepper-orange text-white shadow-lg"
                : "text-text-muted hover:text-text-primary"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    {/* Content */}
    <main className="max-w-7xl mx-auto px-[var(--space-page)] py-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-pepper-red/30 border-t-pepper-red rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab
              key="overview"
              stats={stats}
              fmt={fmt}
              fmtShortDate={fmtShortDate}
              maxDailyTotal={maxDailyTotal}
              syncExchange={syncExchange}
            />
          )}
          {activeTab === "usage" && (
            <UsageTab
              key="usage"
              usage={usage}
              usageTotal={usageTotal}
              usagePage={usagePage}
              setUsagePage={setUsagePage}
              usageType={usageType}
              setUsageType={setUsageType}
              usageEmail={usageEmail}
              setUsageEmail={setUsageEmail}
              usageDateFrom={usageDateFrom}
              setUsageDateFrom={setUsageDateFrom}
              usageDateTo={usageDateTo}
              setUsageDateTo={setUsageDateTo}
              fetchUsage={fetchUsage}
              fmt={fmt}
              fmtDate={fmtDate}
              callTypeBadge={callTypeBadge}
              statusBadge={statusBadge}
            />
          )}
          {activeTab === "crm" && (
            <CRMTab
              key="crm"
              users={users}
              usersTotal={usersTotal}
              usersPage={usersPage}
              setUsersPage={setUsersPage}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              fetchUsers={fetchUsers}
              fmtDate={fmtDate}
            />
          )}
        </AnimatePresence>
      )}
    </main>
  </div>
);
}
