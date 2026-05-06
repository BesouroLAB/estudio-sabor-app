"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ChevronLeft, ChevronRight, Shield, Users, 
  Plus, Minus, Loader2, Trash2, MapPin, Phone, 
  Store, Mail, AlertCircle, Info, UserX, Lock, Unlock, MessageSquareText
} from "lucide-react";
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
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const adjustCredits = async (userId: string, amount: number) => {
    if (amount === 0) return;
    setLoading(`credit-${userId}`);
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
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserProfile>) => {
    setLoading(`update-${userId}`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(`Erro ao atualizar: ${err.error}`);
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(`delete-${userId}`);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(`Erro ao excluir: ${err.error}`);
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setLoading(null);
      setDeleteId(null);
    }
  };

  const accountBadge = (tier: string) => {
    const configs: Record<string, { bg: string, text: string, border: string, label: string }> = {
      free: { bg: "bg-[#F7F7F7]", text: "text-[#717171]", border: "border-[#EAEAEC]", label: "Free" },
      starter: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", label: "Starter" },
      pro: { bg: "bg-red-50", text: "text-[#EA1D2C]", border: "border-red-100", label: "Pro" },
      intermediate: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", label: "Intermediário" },
      advanced: { bg: "bg-red-50", text: "text-[#EA1D2C]", border: "border-red-100", label: "Avançado" },
    };
    const config = configs[tier?.toLowerCase()] || configs.free;
    return (
      <span className={cn(
        "inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
        config.bg, config.text, config.border
      )}>
        {config.label}
      </span>
    );
  };

  const crmStatusBadge = (status?: string) => {
    if (status === 'blocked') {
      return <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">Bloqueado</span>;
    }
    if (status === 'inactive') {
      return <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">Inativo</span>;
    }
    return <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">Ativo</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Search & Statistics */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="bg-white border border-[#EAEAEC] rounded-xl p-4 shadow-sm flex-1 w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A6A6] group-focus-within:text-[#EA1D2C] transition-colors"
              />
              <input
                type="text"
                placeholder="Pesquisar por nome, e-mail ou estabelecimento..."
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
      </div>

      {/* Users Table Card */}
      <div className="bg-white border border-[#EAEAEC] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#EAEAEC]">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-[#717171] uppercase tracking-wider w-[35%]">
                  Cliente & Contato
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-[#717171] uppercase tracking-wider">
                  Status & Plano
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-[#717171] uppercase tracking-wider">
                  Créditos
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-[#717171] uppercase tracking-wider">
                  Ações (CRM)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F1F0]">
              {(users || []).map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#FAFAFA] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      {/* Logo Display */}
                      <div className="w-10 h-10 rounded-full bg-[#F7F7F7] border border-[#EAEAEC] flex items-center justify-center overflow-hidden shrink-0">
                        {user.logo_url ? (
                          <img src={user.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Users size={18} className="text-[#A6A6A6]" />
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[#3E3E3E] text-sm font-bold">{user.full_name || "Sem Nome"}</span>
                          {user.role === 'admin' && (
                            <span title="Administrador">
                              <Shield size={12} className="text-purple-500" />
                            </span>
                          )}
                          <span className="text-[10px] text-[#A6A6A6] font-medium px-1.5 py-0.5 bg-[#F7F7F7] rounded border border-[#EAEAEC]">
                            ID: {user.id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#717171]">
                          <span className="flex items-center gap-1">
                            <Mail size={12} className="text-[#A6A6A6]" /> {user.email}
                          </span>
                          {user.establishment_name && (
                            <span className="flex items-center gap-1 font-semibold text-[#EA1D2C]">
                              <Store size={12} /> {user.establishment_name}
                            </span>
                          )}
                          {user.city && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {user.city}
                            </span>
                          )}
                          {user.phone && (
                            <a 
                              href={`https://wa.me/55${user.phone.replace(/\D/g, '')}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                              title="Chamar no WhatsApp"
                            >
                              <Phone size={12} /> {user.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <div className="flex items-center gap-2">
                        {crmStatusBadge(user.status)}
                        {accountBadge(user.current_tier)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-[#3E3E3E] font-bold">
                          {user.total_purchases || 0} compras realizadas
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Investimento: R$ {user.total_spent_brl?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F7] rounded-xl border border-[#EAEAEC]">
                        <button
                          onClick={() => adjustCredits(user.id, -1)}
                          disabled={loading === `credit-${user.id}`}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:bg-red-50 hover:text-[#EA1D2C] hover:border-[#EA1D2C]/30 transition-all shadow-sm active:scale-90"
                        >
                          <Minus size={14} />
                        </button>
                        
                        <div className="relative group">
                          <input
                            type="number"
                            key={user.credits}
                            defaultValue={user.credits}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                const target = e.target as HTMLInputElement;
                                const newVal = parseInt(target.value);
                                if (!isNaN(newVal) && newVal !== user.credits) {
                                  await adjustCredits(user.id, newVal - user.credits);
                                  target.blur();
                                }
                              }
                            }}
                            onBlur={async (e) => {
                              const newVal = parseInt(e.target.value);
                              if (!isNaN(newVal) && newVal !== user.credits) {
                                await adjustCredits(user.id, newVal - user.credits);
                              }
                            }}
                            className="w-16 h-8 bg-transparent text-center text-sm font-bold text-[#3E3E3E] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:bg-white focus:ring-1 focus:ring-[#EA1D2C]/20 rounded-lg transition-all"
                          />
                        </div>

                        <button
                          onClick={() => adjustCredits(user.id, 1)}
                          disabled={loading === `credit-${user.id}`}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm active:scale-90"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {loading === `credit-${user.id}` && (
                        <span className="text-[9px] font-bold text-[#EA1D2C] animate-pulse">Sincronizando...</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex flex-col items-end mr-2 text-right">
                        <span className="text-[10px] text-[#A6A6A6] font-bold uppercase tracking-widest">Acesso / Cad</span>
                        <span className="text-[10px] text-[#3E3E3E] font-semibold">{user.last_login_at ? fmtDate(user.last_login_at) : 'N/A'}</span>
                        <span className="text-[9px] text-[#A6A6A6] font-medium">{fmtDate(user.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const note = prompt("Anotações para este cliente:", user.admin_notes || "");
                            if (note !== null) updateUser(user.id, { admin_notes: note });
                          }}
                          disabled={loading === `update-${user.id}`}
                          className="w-8 h-8 rounded-lg border border-[#EAEAEC] flex items-center justify-center text-[#A6A6A6] hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all disabled:opacity-50"
                          title={user.admin_notes ? "Ver/Editar Anotações" : "Adicionar Anotação"}
                        >
                          <MessageSquareText size={14} className={user.admin_notes ? "text-blue-500" : ""} />
                        </button>

                        <button
                          onClick={() => {
                            const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
                            if (confirm(`Deseja realmente ${newStatus === 'blocked' ? 'BLOQUEAR' : 'DESBLOQUEAR'} este usuário?`)) {
                              updateUser(user.id, { status: newStatus });
                            }
                          }}
                          disabled={loading === `update-${user.id}`}
                          className="w-8 h-8 rounded-lg border border-[#EAEAEC] flex items-center justify-center text-[#A6A6A6] hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50 transition-all disabled:opacity-50"
                          title={user.status === 'blocked' ? "Desbloquear Conta" : "Bloquear Usuário temporariamente"}
                        >
                          {user.status === 'blocked' ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>

                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="w-8 h-8 rounded-lg border border-[#EAEAEC] flex items-center justify-center text-[#A6A6A6] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                          title="Excluir Usuário e Apagar Dados"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-[#F7F7F7] border-t border-[#EAEAEC] gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[#A6A6A6] text-[10px] font-bold uppercase tracking-widest">
              {usersTotal} clientes cadastrados
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EAEAEC]/50 rounded-full text-[10px] text-[#717171] font-bold">
              <Shield size={10} /> LGPD Compliance Ativo
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#A6A6A6] font-bold uppercase tracking-widest mr-2">
                Página {usersPage} de {totalPages}
              </span>
              <button
                onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                disabled={usersPage <= 1}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setUsersPage(Math.min(totalPages, usersPage + 1))}
                disabled={usersPage >= totalPages}
                className="w-9 h-9 rounded-lg bg-white border border-[#EAEAEC] flex items-center justify-center text-[#717171] hover:text-[#EA1D2C] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LGPD Information Banner */}
      <div className="bg-[#FAFAFA] border border-[#EAEAEC] border-dashed rounded-xl p-6 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#EAEAEC] flex items-center justify-center shrink-0">
          <Info size={20} className="text-[#717171]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#3E3E3E]">Gestão de Dados & LGPD</h4>
          <p className="text-xs text-[#717171] leading-relaxed max-w-2xl">
            Este painel exibe dados pessoais coletados sob a base legal de Execução de Contrato. 
            Todas as exclusões de usuários solicitadas devem ser processadas imediatamente através do botão de exclusão acima, 
            garantindo o Direito ao Esquecimento previsto na Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                  <UserX size={32} className="text-[#EA1D2C]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#3E3E3E]">Excluir Usuário Permanentemente?</h3>
                  <p className="text-sm text-[#717171]">
                    Esta ação é irreversível. O usuário perderá acesso a todos os seus créditos e histórico de gerações.
                  </p>
                </div>
              </div>
              <div className="flex border-t border-[#EAEAEC]">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 text-sm font-bold text-[#717171] hover:bg-[#FAFAFA] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => deleteId && deleteUser(deleteId)}
                  disabled={loading === `delete-${deleteId}`}
                  className="flex-1 py-4 text-sm font-bold text-white bg-[#EA1D2C] hover:bg-[#d1192a] transition-colors flex items-center justify-center gap-2"
                >
                  {loading === `delete-${deleteId}` ? <Loader2 size={16} className="animate-spin" /> : "Confirmar Exclusão"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
