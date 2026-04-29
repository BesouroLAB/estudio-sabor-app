"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Shield, Users, Plus, Minus, Loader2 } from "lucide-react";
import type { UserProfile } from "./types";
import { cn } from "@/lib/utils";

interface CRMTabProps {
  users: UserProfile[];
  usersTotal: number;
  usersPage: number;
  setUsersPage: (p: number) => void;
  userSearch: string;
  setUserSearch: (s: string) => void;
  fetchUsers: () => void;
  fmtDate: (s: string) => string;
}

export function CRMTab({
  users,
  usersTotal,
  usersPage,
  setUsersPage,
  userSearch,
  setUserSearch,
  fetchUsers,
  fmtDate,
}: CRMTabProps) {
  const totalPages = Math.ceil(usersTotal / 20);
  const [adjustingUser, setAdjustingUser] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [loading, setLoading] = useState<string | null>(null);

  const adjustCredits = async (userId: string, amount: number) => {
    setLoading(userId);
    try {
      const res = await fetch("/api/admin/users/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error}`);
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setLoading(null);
      setAdjustingUser(null);
    }
  };

  const accountBadge = (type: string) => {
    const configs: Record<string, { bg: string, text: string, border: string }> = {
      free: { bg: "bg-[#F7F7F7]", text: "text-[#717171]", border: "border-[#EAEAEC]" },
      starter: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
      pro: { bg: "bg-red-50", text: "text-[#EA1D2C]", border: "border-red-100" },
      enterprise: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    };
    const config = configs[type] || configs.free;
    return (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          config.bg, config.text, config.border
        )}
      >
        {type}
      </span>
    );
  };

  const roleBadge = (role: string) =>
    role === "admin" ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
        <Shield size={10} />
        Admin
      </span>
    ) : (
      <span className="text-[#A6A6A6] text-[10px] font-bold uppercase tracking-wider">
        Usuário
      </span>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#EAEAEC] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A6A6] group-focus-within:text-[#EA1D2C] transition-colors"
            />
            <input
              type="text"
              placeholder="Pesquisar por nome ou e-mail..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setUsersPage(1);
                  fetchUsers();
                }
              }}
              className="w-full h-11 pl-11 pr-4 rounded-lg bg-[#F7F7F7] border border-[#EAEAEC] text-sm text-[#3E3E3E] placeholder:text-[#A6A6A6] focus:border-[#EA1D2C]/50 focus:bg-white outline-none transition-all"
            />
          </div>
          <button
            onClick={() => {
              setUsersPage(1);
              fetchUsers();
            }}
            className="h-11 px-6 rounded-lg bg-[#EA1D2C] text-white text-sm font-bold hover:bg-[#d1192a] transition-all shadow-sm active:scale-95"
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white border border-[#EAEAEC] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#EAEAEC]">
                {["Cliente", "Plano", "Permissão", "Créditos", "Data Cadastro"].map(
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#FAFAFA] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="text-[#3E3E3E] text-sm font-bold">{user.email}</span>
                        <span className="text-[10px] text-[#A6A6A6] font-medium mt-0.5">{user.full_name || "Sem nome definido"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{accountBadge(user.account_type)}</td>
                  <td className="px-6 py-4">{roleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F7F7F7] text-[#3E3E3E] text-xs font-bold border border-[#EAEAEC] min-w-[2.5rem] text-center">
                          {user.credits_remaining}
                      </span>

                      {adjustingUser === user.id ? (
                        <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-1 duration-200">
                          <input
                            type="number"
                            min={1}
                            value={adjustAmount}
                            onChange={(e) => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-14 h-7 rounded-lg border border-[#DDDDE0] text-center text-xs font-bold outline-none focus:border-[#EA1D2C]/50"
                          />
                          <button
                            onClick={() => adjustCredits(user.id, -adjustAmount)}
                            disabled={loading === user.id}
                            className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            {loading === user.id ? <Loader2 size={12} className="animate-spin" /> : <Minus size={12} />}
                          </button>
                          <button
                            onClick={() => adjustCredits(user.id, adjustAmount)}
                            disabled={loading === user.id}
                            className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                          >
                            {loading === user.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                          </button>
                          <button
                            onClick={() => setAdjustingUser(null)}
                            className="text-[10px] text-[#A6A6A6] hover:text-[#3E3E3E] ml-1 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAdjustingUser(user.id); setAdjustAmount(10); }}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#A6A6A6] hover:text-[#EA1D2C] hover:border-[#EA1D2C]/30 transition-all"
                          title="Ajustar créditos"
                        >
                          <Plus size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#A6A6A6] text-[11px] font-medium whitespace-nowrap">
                    {fmtDate(user.created_at)}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                        <Users size={32} className="text-[#DDDDE0]" />
                        <p className="text-[#A6A6A6] text-xs font-bold uppercase tracking-widest">Nenhum cliente encontrado</p>
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
              {usersTotal} clientes <span className="mx-2 text-[#EAEAEC]">|</span> Página {usersPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                disabled={usersPage <= 1}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setUsersPage(Math.min(totalPages, usersPage + 1))
                }
                disabled={usersPage >= totalPages}
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
