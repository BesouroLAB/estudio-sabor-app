"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Users, 
  Activity, 
  Settings as SettingsIcon,
  LogOut,
  Zap,
  RefreshCw,
  ChevronDown,
  LayoutDashboard,
  User,
  TrendingUp,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Sub-components
import { OverviewTab } from "./TabOverview";
import { CRMTab } from "./TabCRM";
import { UsageTab } from "./TabUsage";
import { SettingsTab } from "./TabSettings";
import { TransactionsTab } from "./TabTransactions";
import type { Tab, Stats, UserProfile, UsageRecord, SystemSetting, Transaction } from "./types";

const LOGO_LIGHT_BG = "https://res.cloudinary.com/do8gdtozt/image/upload/v1761865865/logo_estudio_sabor_horizontal-upscale-scale-6_00x_nmbn9t.png";

interface AdminDashboardProps {
  userEmail: string;
}

export default function AdminDashboard({ userEmail }: AdminDashboardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // States for data
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [usageTotal, setUsageTotal] = useState(0);
  const [usagePage, setUsagePage] = useState(1);
  const [usageType, setUsageType] = useState("");
  const [usageEmail, setUsageEmail] = useState("");
  const [usageDateFrom, setUsageDateFrom] = useState("");
  const [usageDateTo, setUsageDateTo] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txPage, setTxPage] = useState(1);
  const [txType, setTxType] = useState("");

  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch functions
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || data);
      }
    } catch (e) {
      console.error("Stats fetch failed:", e);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(usersPage),
      limit: "20",
      search: userSearch,
    });
    try {
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
          setUsersTotal(data.length);
        } else {
          setUsers(data.users || []);
          setUsersTotal(data.total || 0);
        }
      }
    } catch (e) {
      console.error("Users fetch failed:", e);
    }
  }, [usersPage, userSearch]);

  const fetchUsage = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(usagePage),
      limit: "50",
      callType: usageType,
      userEmail: usageEmail,
      dateFrom: usageDateFrom,
      dateTo: usageDateTo,
    });
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

  const fetchTransactions = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(txPage),
      limit: "50",
      type: txType,
    });
    try {
      const res = await fetch(`/api/admin/transactions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setTxTotal(data.total);
      }
    } catch (e) {
      console.error("Transactions fetch failed:", e);
    }
  }, [txPage, txType]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setSettings(await res.json());
    } catch (e) {
      console.error("Settings fetch failed:", e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchSettings()]).finally(() => setLoading(false));
  }, [fetchStats, fetchSettings]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const syncExchange = async () => {
    const res = await fetch("/api/admin/exchange/sync", { method: "POST" });
    if (res.ok) fetchStats();
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Visão Geral", icon: <TrendingUp size={16} /> },
    { id: "crm", label: "Clientes", icon: <Users size={16} /> },
    { id: "transactions", label: "Finanças", icon: <DollarSign size={16} /> },
    { id: "usage", label: "Telemetria", icon: <Zap size={16} /> },
    { id: "settings", label: "Sistema", icon: <Shield size={16} /> },
  ];

  const fmt = (n: number, d = 2) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtDate = (s: string) => new Date(s).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const fmtShortDate = (s: string) => new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  const maxDailyTotal = stats?.dailyCalls ? Math.max(...stats.dailyCalls.map(d => d.image_generation + d.copywriting)) : 1;

  return (
    <div className="min-h-screen bg-[#F7F7F7] font-sans text-[#3E3E3E]">
      {/* Admin Top Header - Two Rows */}
      <header className="bg-white border-b border-[#EAEAEC] sticky top-0 z-50 shadow-sm">
        {/* Row 1: Logo, Tabs, Profile - Height Increased to h-28 with top padding */}
        <div className="h-28 border-b border-[#F3F1F0] pt-4">
          <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-16">
              {/* Official Logo - Larger */}
              <Link href="/estudio" className="flex items-center shrink-0">
                <img 
                  src={LOGO_LIGHT_BG} 
                  alt="Estúdio & Sabor" 
                  className="h-20 w-auto object-contain"
                />
              </Link>

              {/* Tab Navigation - More Spacing */}
              <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#F7F7F7] rounded-xl border border-[#EAEAEC]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-white text-[#EA1D2C] shadow-sm border border-[#EAEAEC]"
                        : "text-[#717171] hover:text-[#3E3E3E] hover:bg-[#EAEAEC]/30"
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchStats()}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] transition-all shadow-sm"
              >
                <RefreshCw size={16} />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 pl-4 pr-3 py-2 rounded-xl bg-white border border-[#EAEAEC] hover:border-[#EA1D2C]/20 transition-all shadow-sm group"
                >
                  <div className="hidden md:flex flex-col items-end gap-0.5">
                    <span className="text-[#3E3E3E] text-xs font-semibold leading-tight">{userEmail.split('@')[0]}</span>
                    <span className="text-[#A6A6A6] text-[10px] font-medium leading-tight">Administrador</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#F7F7F7] flex items-center justify-center border border-[#EAEAEC] group-hover:border-[#EA1D2C]/20 transition-colors">
                    <User size={16} className="text-[#717171] group-hover:text-[#EA1D2C] transition-colors" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-[#EAEAEC] rounded-xl shadow-xl overflow-hidden z-[100] p-1.5"
                    >
                      <button
                        onClick={() => router.push("/estudio")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-[#717171] hover:text-[#EA1D2C] hover:bg-red-50 rounded-lg transition-all"
                      >
                        <LayoutDashboard size={14} />
                        Área do Cliente
                      </button>
                      <div className="h-px bg-[#F3F1F0] my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-[#EA1D2C] hover:bg-red-50 rounded-lg transition-all"
                      >
                        <LogOut size={14} />
                        Sair do Sistema
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Status Bar — Increased Height to h-20 for better vertical breathing */}
        <div className="mt-8 h-20 bg-[#FAFAFA] border-b border-[#EAEAEC]">
          <div className="max-w-7xl mx-auto px-8 h-full flex items-center">
            <div className="flex items-center gap-16 w-full">

              {/* Date */}
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-[#EAEAEC]">
                  <Activity size={15} className="text-[#A6A6A6]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#A6A6A6] font-medium leading-tight">Hoje</p>
                  <p className="text-[15px] text-[#3E3E3E] font-semibold leading-tight">
                    {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="w-px h-7 bg-[#EAEAEC]" />

              {/* Exchange */}
              <div className="flex items-center gap-4 cursor-help" title="USD/BRL via AwesomeAPI">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <DollarSign size={15} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-[#A6A6A6] font-medium leading-tight">Câmbio</p>
                  <p className="text-[15px] text-[#3E3E3E] font-semibold leading-tight">R$ {fmt(stats?.exchangeRate || 5.50)}</p>
                </div>
              </div>

              <div className="w-px h-7 bg-[#EAEAEC]" />

              {/* Daily spend */}
              <div className="flex items-center gap-4 cursor-help" title="Custo de API acumulado hoje">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
                  <Zap size={15} className="text-[#EA1D2C]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#A6A6A6] font-medium leading-tight">Gasto hoje</p>
                  <p className="text-[15px] text-[#3E3E3E] font-semibold leading-tight">R$ {fmt(stats?.spentToday || 0)}</p>
                </div>
              </div>

              <div className="w-px h-7 bg-[#EAEAEC]" />

              {/* Net profit */}
              <div className="flex items-center gap-4 cursor-help" title="Receita - Custos de API">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <TrendingUp size={15} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-[#A6A6A6] font-medium leading-tight">Lucro</p>
                  <p className="text-[15px] text-emerald-600 font-semibold leading-tight">R$ {fmt(stats?.profit || 0)}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>






      {/* Main Content Area - Increased top padding for content breathing room */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        
        {/* Mobile Header Title */}
        <div className="lg:hidden mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EA1D2C] flex items-center justify-center text-white shadow-lg shadow-[#EA1D2C]/20">
                <Shield size={20} />
            </div>
            <div>
                <h1 className="text-lg font-bold text-[#3E3E3E] tracking-tight">Admin Console</h1>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Operacional</span>
            </div>
          </div>
          
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="bg-white border border-[#EAEAEC] rounded-lg px-3 py-2 text-sm font-bold text-[#3E3E3E] outline-none shadow-sm"
          >
            {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={32} className="text-[#EA1D2C] animate-spin opacity-20" />
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
                callTypeBadge={(t) => (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    t === "image_generation" ? "bg-red-50 text-[#EA1D2C] border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                    {t === "image_generation" ? "Imagem" : "Copy"}
                  </span>
                )}
                statusBadge={(s) => (
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    s === "success" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-[#EA1D2C] shadow-[0_0_8px_rgba(234,29,44,0.5)]"
                  )} />
                )}
              />
            )}
            {activeTab === "transactions" && (
              <TransactionsTab
                key="transactions"
                transactions={transactions}
                total={txTotal}
                page={txPage}
                setPage={setTxPage}
                type={txType}
                setType={setTxType}
                fetchTransactions={fetchTransactions}
                fmt={fmt}
                fmtDate={fmtDate}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab 
                key="settings"
                settings={settings}
                fetchSettings={fetchSettings}
              />
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
