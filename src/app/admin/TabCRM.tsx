import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import type { UserProfile } from "./types";

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

  const accountBadge = (type: string) => {
    const colors: Record<string, string> = {
      free: "bg-white/5 text-text-secondary border-white/10",
      starter: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      pro: "bg-pepper-orange/10 text-pepper-orange border-pepper-orange/20",
      enterprise: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
    return (
      <span
        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[type] || colors.free}`}
      >
        {type}
      </span>
    );
  };

  const roleBadge = (role: string) =>
    role === "admin" ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pepper-red/10 text-pepper-red border border-pepper-red/20">
        <Shield size={9} />
        Admin
      </span>
    ) : (
      <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
        User
      </span>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Search */}
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setUsersPage(1);
                  fetchUsers();
                }
              }}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-input border border-border-default text-text-primary text-xs placeholder:text-text-muted focus:border-pepper-red/50 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => {
              setUsersPage(1);
              fetchUsers();
            }}
            className="h-9 px-4 rounded-lg bg-gradient-to-r from-pepper-red to-pepper-orange text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {["E-mail", "Nome", "Plano", "Role", "Créditos", "Desde"].map(
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border-subtle/50 hover:bg-bg-elevated/50 transition-colors"
                >
                  <td className="px-4 py-3 text-text-primary text-xs font-medium">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">
                    {user.full_name || "—"}
                  </td>
                  <td className="px-4 py-3">{accountBadge(user.account_type)}</td>
                  <td className="px-4 py-3">{roleBadge(user.role)}</td>
                  <td className="px-4 py-3 text-pepper-orange text-xs font-bold font-mono">
                    {user.credits_remaining}
                  </td>
                  <td className="px-4 py-3 text-text-muted text-[10px] whitespace-nowrap">
                    {fmtDate(user.created_at)}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-text-muted text-sm"
                  >
                    Nenhum cliente encontrado.
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
              {usersTotal} clientes · Página {usersPage} de {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                disabled={usersPage <= 1}
                className="p-1.5 rounded-lg bg-bg-elevated border border-border-default text-text-muted hover:text-text-primary disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() =>
                  setUsersPage(Math.min(totalPages, usersPage + 1))
                }
                disabled={usersPage >= totalPages}
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
