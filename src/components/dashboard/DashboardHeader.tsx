"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User as UserIcon, LogOut, Settings, MessageCircle, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useDashboard } from "@/context/DashboardContext";
import Link from "next/link";

interface DashboardHeaderProps {
  user: User;
  credits: number;
  userName?: string;
  supportLink?: string;
  announcement?: { active: boolean; message: string; type: string } | null;
}

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Início",
  "/dashboard/create": "Criar Foto",
  "/dashboard/history": "Meus Projetos",
  "/dashboard/templates": "Templates & Promos",
  "/dashboard/balance": "Extrato de Créditos",
  "/dashboard/store": "Loja de Créditos",
  "/dashboard/settings": "Configurações",
};

export function DashboardHeader({
  user,
  credits,
  userName,
  supportLink = "https://wa.me/5516988031505",
  announcement,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed } = useDashboard();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const currentPage = breadcrumbMap[pathname] || "Início";
  const isHome = pathname === "/dashboard";

  // Credit badge color based on credit level
  const getCreditStyle = () => {
    if (credits >= 20) return "bg-emerald-50 border-emerald-200 text-emerald-700";
    if (credits >= 5) return "bg-amber-50 border-amber-200 text-amber-700";
    return "bg-red-50 border-red-200 text-[#EA1D2C]";
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#EAEAEC]">
      {/* Announcement Banner */}
      {announcement?.active && (
        <div className="bg-[#EA1D2C] text-white text-center text-xs font-medium py-1.5 px-4">
          {announcement.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-[#A6A6A6] hover:text-[#3E3E3E] transition-colors font-medium">
            Início
          </Link>
          {!isHome && (
            <>
              <ChevronRight size={14} className="text-[#DDDDE0]" />
              <span className="text-[#3E3E3E] font-semibold">{currentPage}</span>
            </>
          )}
        </nav>

        {/* Right: Credits + User */}
        <div className="flex items-center gap-3">
          {/* Credits Badge */}
          <Link
            href="/dashboard/store"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors hover:opacity-80 ${getCreditStyle()}`}
          >
            <Sparkles size={13} />
            <span>{credits}</span>
            <span className="opacity-70 font-medium hidden sm:inline">créditos</span>
          </Link>

          <div className="h-6 w-px bg-[#EAEAEC] hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 transition-all cursor-pointer group text-left"
            >
              <span className="hidden sm:block text-xs font-semibold text-[#3E3E3E] group-hover:text-[#717171] transition-colors max-w-[120px] truncate">
                {userName || user.email?.split("@")[0]}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#F7F7F7] flex items-center justify-center transition-all group-hover:bg-[#EAEAEC]">
                <UserIcon
                  size={16}
                  className={cn(
                    "transition-colors",
                    dropdownOpen ? "text-[#EA1D2C]" : "text-[#717171] group-hover:text-[#3E3E3E]"
                  )}
                />
              </div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#EAEAEC] p-1.5 z-50"
                >
                  {user.id === "mock-temporario" ? (
                    <div className="p-3 bg-red-50 rounded-lg mb-1.5 border border-red-100">
                      <p className="text-[10px] font-bold text-[#EA1D2C] uppercase tracking-wider mb-1.5">Modo Visitante</p>
                      <p className="text-[10px] text-[#717171] leading-snug mb-2.5">Crie uma conta para salvar suas criações.</p>
                      <button
                        onClick={() => { router.push("/signup"); setDropdownOpen(false); }}
                        className="w-full py-2 bg-[#EA1D2C] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#d1192a] transition-colors"
                      >
                        Criar Conta Grátis
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { router.push("/dashboard/settings"); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-[#717171] hover:bg-[#F7F7F7] rounded-lg transition-colors flex items-center gap-2.5"
                    >
                      <Settings size={14} />
                      Configurações
                    </button>
                  )}

                  <a
                    href={supportLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm text-[#717171] hover:bg-[#F7F7F7] rounded-lg transition-colors flex items-center gap-2.5"
                  >
                    <MessageCircle size={14} className="text-emerald-500" />
                    Suporte WhatsApp
                  </a>

                  <div className="h-px bg-[#EAEAEC] my-1" />

                  {user.id === "mock-temporario" ? (
                    <button
                      onClick={() => { router.push("/login"); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-[#3E3E3E] hover:bg-[#F7F7F7] rounded-lg transition-colors flex items-center gap-2.5"
                    >
                      <LogOut size={14} />
                      Fazer Login
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        setDropdownOpen(false);
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = "/login";
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-[#EA1D2C] hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2.5"
                    >
                      <LogOut size={14} />
                      Sair da conta
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
