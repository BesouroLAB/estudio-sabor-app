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
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Sub-components
import { OverviewTab } from "./TabOverview";
import { CRMTab } from "./TabCRM";
import { UsageTab } from "./TabUsage";
import { SettingsTab } from "./TabSettings";
import type { Tab, Stats, UserProfile, UsageRecord, SystemSetting } from "./types";

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
      if (res.ok) setStats(await res.json());
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
      type: usageType,
      email: usageEmail,
      from: usageDateFrom,
      to: usageDateTo,
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
    { id: "usage", label: "Telemetria", icon: <Zap size={16} /> },
    { id: "settings", label: "Sistema", icon: <Shield size={16} /> },
  ];

  const fmt = (n: number, d = 2) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtDate = (s: string) => new Date(s).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const fmtShortDate = (s: string) => new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  const maxDailyTotal = stats?.dailyCalls ? Math.max(...stats.dailyCalls.map(d => d.image_generation + d.copywriting)) : 1;

  return (
    <div className="min-h-screen bg-[#F7F7F7] font-sans text-[#3E3E3E]">
      {/* Admin Top Header */}
      <header className="h-20 bg-white border-b border-[#EAEAEC] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Official Logo */}
            <Link href="/dashboard" className="flex items-center shrink-0">
              <img 
                src={LOGO_LIGHT_BG} 
                alt="Estúdio & Sabor" 
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Tab Navigation (Horizontal) */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#F7F7F7] rounded-xl border border-[#EAEAEC]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
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
              className="w-10 h-10 rounded-xl bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] hover:border-[#EA1D2C]/30 transition-all shadow-sm"
            >
              <RefreshCw size={18} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 pl-4 pr-3 py-2 rounded-xl bg-white border border-[#EAEAEC] hover:border-[#EA1D2C]/30 transition-all shadow-sm group"
              >
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[#3E3E3E] text-sm font-bold leading-none">Administrator</span>
                  <span className="text-[#A6A6A6] text-[10px] mt-1 font-bold uppercase tracking-widest">{userEmail.split('@')[0]}</span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#F7F7F7] flex items-center justify-center border border-[#EAEAEC]">
                  <User size={18} className="text-[#717171]" />
                </div>
                <ChevronDown size={14} className={cn("text-[#A6A6A6] transition-transform", dropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-[#EAEAEC] rounded-xl shadow-xl overflow-hidden z-[100] p-1.5"
                  >
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-[#717171] hover:text-[#EA1D2C] hover:bg-red-50 rounded-lg transition-all"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard Cliente
                    </button>
                    <div className="h-px bg-[#F3F1F0] my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-[#EA1D2C] hover:bg-red-50 rounded-lg transition-all"
                    >
                      <LogOut size={16} />
                      Sair do Sistema
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
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
