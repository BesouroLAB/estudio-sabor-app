"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminStats {
  totalUsers: number;
  totalCredits: number;
  totalRevenue: number;
  totalApiCost: number;
  profit: number;
  exchangeRate: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  credits: number;
  role: string;
  city?: string;
  phone?: string;
  establishment_name?: string;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  full_name: string;
  type: string;
  credits_amount: number;
  amount_paid_brl: number;
  status: string;
  created_at: string;
}

interface ApiUsage {
  id: string;
  user_id: string;
  call_type: string;
  model: string;
  cost_brl: number;
  created_at: string;
}

export function AdminView() {
  const [activeTab, setActiveTab] = useState<"overview" | "crm" | "usage" | "settings">("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [usageLogs, setUsageLogs] = useState<ApiUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users")
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData.stats);
      setTransactions(statsData.recentTransactions || []);
      setUsageLogs(statsData.recentUsage || []);
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateCredits = async (userId: string, newCredits: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: newCredits })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, credits: newCredits } : u));
      }
    } catch (err) {
      console.error("Failed to update credits", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação é irreversível.")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.establishment_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="animate-spin text-[#EA1D2C]" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F7F7] overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-white border-b border-[#EAEAEC]">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Painel do Administrador</h1>
            <p className="text-sm text-[#717171]">Controle total da operação e métricas financeiras</p>
          </div>
          <div className="flex gap-2 bg-[#F1F1F3] p-1 rounded-xl">
            <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Métricas" icon={<TrendingUp size={16} />} />
            <TabButton active={activeTab === "crm"} onClick={() => setActiveTab("crm")} label="CRM" icon={<Users size={16} />} />
            <TabButton active={activeTab === "usage"} onClick={() => setActiveTab("usage")} label="Uso & Logs" icon={<Activity size={16} />} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto w-full space-y-8">
          
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Usuários Totais" 
                  value={stats?.totalUsers || 0} 
                  icon={<Users size={20} />} 
                  trend="+12%" 
                  color="blue"
                />
                <StatCard 
                  title="Receita Total" 
                  value={`R$ ${stats?.totalRevenue.toFixed(2)}`} 
                  icon={<DollarSign size={20} />} 
                  trend="+8.2%" 
                  color="green"
                />
                <StatCard 
                  title="Custo API (IA)" 
                  value={`R$ ${stats?.totalApiCost.toFixed(2)}`} 
                  icon={<Activity size={20} />} 
                  trend="-3.5%" 
                  color="red"
                />
                <StatCard 
                  title="Lucro Líquido" 
                  value={`R$ ${stats?.profit.toFixed(2)}`} 
                  icon={<TrendingUp size={20} />} 
                  trend="+15%" 
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div className="bg-white rounded-3xl border border-[#EAEAEC] overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-[#EAEAEC] flex items-center justify-between">
                    <h3 className="font-bold text-[#1A1A1A]">Últimas Vendas</h3>
                    <ChevronRight size={18} className="text-[#A6A6A6]" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F9F9FA] text-[10px] font-bold text-[#A6A6A6] uppercase tracking-wider">
                          <th className="px-6 py-4">Usuário</th>
                          <th className="px-6 py-4">Créditos</th>
                          <th className="px-6 py-4">Valor</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F1F3]">
                        {transactions.slice(0, 8).map((tx) => (
                          <tr key={tx.id} className="hover:bg-[#F9F9FA] transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-[#3E3E3E]">{tx.full_name || "Desconhecido"}</p>
                              <p className="text-[10px] text-[#A6A6A6]">{new Date(tx.created_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-[#717171]">+{tx.credits_amount}</td>
                            <td className="px-6 py-4 text-sm font-bold text-[#1A1A1A]">R$ {tx.amount_paid_brl?.toFixed(2) || "0.00"}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold">
                                <CheckCircle2 size={10} /> Pago
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* API Usage */}
                <div className="bg-white rounded-3xl border border-[#EAEAEC] overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-[#EAEAEC] flex items-center justify-between">
                    <h3 className="font-bold text-[#1A1A1A]">Consumo de IA (Tempo Real)</h3>
                    <Activity size={18} className="text-[#EA1D2C] animate-pulse" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F9F9FA] text-[10px] font-bold text-[#A6A6A6] uppercase tracking-wider">
                          <th className="px-6 py-4">Operação</th>
                          <th className="px-6 py-4">Modelo</th>
                          <th className="px-6 py-4">Custo BRL</th>
                          <th className="px-6 py-4">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F1F3]">
                        {usageLogs.slice(0, 8).map((log) => (
                          <tr key={log.id} className="hover:bg-[#F9F9FA] transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-[#3E3E3E]">{log.call_type}</p>
                            </td>
                            <td className="px-6 py-4 text-[10px] font-medium text-[#717171]">{log.model}</td>
                            <td className="px-6 py-4 text-sm font-bold text-red-500">R$ {log.cost_brl?.toFixed(3)}</td>
                            <td className="px-6 py-4 text-[10px] text-[#A6A6A6]">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "crm" && (
            <div className="space-y-6">
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A6A6]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por nome, email ou estabelecimento..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#EAEAEC] rounded-2xl focus:ring-2 focus:ring-[#EA1D2C]/20 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#EAEAEC] rounded-2xl text-[#3E3E3E] font-bold text-sm hover:bg-[#F9F9FA] transition-all">
                  <Filter size={18} /> Filtros
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-[#EAEAEC] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F9F9FA] text-[10px] font-bold text-[#A6A6A6] uppercase tracking-wider">
                        <th className="px-6 py-6">Usuário / CRM</th>
                        <th className="px-6 py-6 text-center">Créditos</th>
                        <th className="px-6 py-6">Localização</th>
                        <th className="px-6 py-6">Status</th>
                        <th className="px-6 py-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F1F3]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#F9F9FA] transition-colors">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#EA1D2C] font-bold text-lg">
                                {u.full_name?.[0] || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1A1A1A] flex items-center gap-1.5">
                                  {u.full_name}
                                  {u.role === 'admin' && <ShieldCheck size={14} className="text-blue-500" />}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] text-[#A6A6A6] flex items-center gap-1"><Mail size={10}/> {u.email}</span>
                                  {u.establishment_name && <span className="text-[10px] text-[#A6A6A6] flex items-center gap-1"><Building2 size={10}/> {u.establishment_name}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center justify-center gap-3">
                              <button 
                                onClick={() => handleUpdateCredits(u.id, Math.max(0, u.credits - 1))}
                                className="w-8 h-8 rounded-lg border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:bg-red-50 hover:text-[#EA1D2C] transition-all"
                              >
                                <Minus size={14} />
                              </button>
                              <input 
                                type="number" 
                                className="w-16 text-center font-bold text-sm bg-transparent outline-none"
                                value={u.credits}
                                onChange={(e) => handleUpdateCredits(u.id, parseInt(e.target.value) || 0)}
                              />
                              <button 
                                onClick={() => handleUpdateCredits(u.id, u.credits + 1)}
                                className="w-8 h-8 rounded-lg border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:bg-green-50 hover:text-green-600 transition-all"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="space-y-1">
                              <p className="text-[11px] text-[#3E3E3E] font-medium flex items-center gap-1.5"><MapPin size={12} className="text-[#A6A6A6]"/> {u.city || "Não inf."}</p>
                              <p className="text-[11px] text-[#3E3E3E] font-medium flex items-center gap-1.5"><Phone size={12} className="text-[#A6A6A6]"/> {u.phone || "Não inf."}</p>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                              Ativo
                            </span>
                          </td>
                          <td className="px-6 py-6 text-right">
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-[#A6A6A6] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white rounded-3xl border border-[#EAEAEC] p-8">
                <h3 className="text-xl font-bold mb-6">Logs Detalhados de Transações</h3>
                {/* Expand this section with more data if needed */}
                <p className="text-[#717171]">Esta seção contém o histórico completo de movimentações financeiras e uso de tokens por modelo.</p>
                <div className="mt-8 overflow-x-auto border border-[#F1F1F3] rounded-2xl">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F9F9FA] text-[10px] font-bold text-[#A6A6A6] uppercase tracking-wider">
                          <th className="px-6 py-4">Usuário</th>
                          <th className="px-6 py-4">Tipo</th>
                          <th className="px-6 py-4">Tokens (In/Out)</th>
                          <th className="px-6 py-4">Custo</th>
                          <th className="px-6 py-4">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F1F3]">
                        {usageLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-[#F9F9FA] transition-colors">
                            <td className="px-6 py-4 text-sm font-medium">{log.user_id?.substring(0,8)}...</td>
                            <td className="px-6 py-4 text-sm">{log.call_type}</td>
                            <td className="px-6 py-4 text-xs text-[#717171]">N/A</td>
                            <td className="px-6 py-4 text-sm font-bold text-[#EA1D2C]">R$ {log.cost_brl?.toFixed(4)}</td>
                            <td className="px-6 py-4 text-xs text-[#A6A6A6]">{new Date(log.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
        ${active 
          ? "bg-white text-[#EA1D2C] shadow-sm" 
          : "text-[#717171] hover:text-[#1A1A1A]"}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, trend, color }: { title: string; value: string | number; icon: React.ReactNode; trend: string; color: "blue" | "green" | "red" | "purple" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const isUp = trend.startsWith("+");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-[32px] border border-[#EAEAEC] shadow-sm flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${isUp ? "text-emerald-500" : "text-red-500"}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#A6A6A6] uppercase tracking-[0.1em] mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-[#1A1A1A]">{value}</h4>
      </div>
    </motion.div>
  );
}
