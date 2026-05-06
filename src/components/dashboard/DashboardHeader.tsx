"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User as UserIcon, LogOut, LogIn, Settings, MessageCircle, ChevronRight, PlusSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useDashboard } from "@/context/DashboardContext";
import Link from "next/link";

interface DashboardHeaderProps {
  user: User | null;
  credits: number;
  userName?: string;
  supportLink?: string;
  announcement?: { active: boolean; message: string; type: string } | null;
}

const breadcrumbMap: Record<string, string> = {
  "/estudio": "Início",
  "/estudio/criar": "Criar Foto",
  "/estudio/minhas-criacoes": "Meus Projetos",
  "/estudio/templates-de-venda": "Templates & Promos",
  "/estudio/extrato-de-creditos": "Extrato de Créditos",
  "/estudio/loja-de-creditos": "Loja de Créditos",
  "/estudio/configuracoes-da-conta": "Configurações",
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
  const { sidebarCollapsed, userCredits } = useDashboard();
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
  const isHome = pathname === "/estudio";

  // Credit badge color based on credit level
  const getCreditStyle = () => {
    if (userCredits >= 20) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
    if (userCredits >= 5) return "bg-amber-500/10 border-amber-500/20 text-amber-500";
    return "bg-brand-red/10 border-brand-red/20 text-brand-red";
  };

  return (
    <header className="sticky top-0 z-30 bg-brand-dark/80 border-b border-white/5 backdrop-blur-xl" suppressHydrationWarning>
      {/* Announcement Banner - More subtle and premium */}
      {announcement?.active && (
        <div className="bg-brand-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="relative z-10 text-white text-center text-[10px] font-black uppercase tracking-[0.3em] py-2 px-4 animate-pulse">
            {announcement.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* Left: Breadcrumb */}
        <nav className="flex items-center gap-3 text-[11px]">
          <Link href="/estudio" className="text-white/30 hover:text-white transition-all font-black uppercase tracking-[0.2em] flex items-center gap-2 group">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red group-hover:scale-125 transition-transform" />
            Início
          </Link>
          {!isHome && (
            <>
              <ChevronRight size={14} className="text-white/10" />
              <span className="text-white font-black uppercase tracking-[0.2em]">{currentPage}</span>
            </>
          )}
        </nav>

        {/* Right: Credits + User */}
        <div className="flex items-center gap-6">
          {/* Credits Badge - High End */}
          <Link
            href="/estudio/loja-de-creditos"
            className="group relative flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-brand-red/30 transition-all active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-brand-orange animate-pulse" />
              <div className="flex flex-col">
                <span className="text-white text-sm font-black leading-none">{userCredits}</span>
                <span className="text-[9px] font-black text-white/30 tracking-widest leading-none">CRÉDITOS</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform">
              <PlusSquare size={14} strokeWidth={3} />
            </div>
          </Link>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 transition-all cursor-pointer group text-left"
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center transition-all border border-white/10 group-hover:border-brand-red/50 shadow-2xl overflow-hidden p-0.5">
                  {user?.id === "mock-temporario" ? (
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                      <UserIcon size={20} className="text-white/30" />
                    </div>
                  ) : (
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName || user?.email}&backgroundColor=111111&fontFamily=Inter&fontWeight=700`} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-brand-dark" />
              </div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 top-full mt-4 w-72 bg-brand-surface/95 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 p-3 z-50 backdrop-blur-2xl"
                >
                  <div className="px-5 py-4 mb-2">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1.5">Sua Conta</p>
                    <p className="text-base font-black text-white truncate tracking-tight">{userName || user?.email}</p>
                    <p className="text-[11px] font-bold text-brand-orange mt-0.5 uppercase tracking-wider">Membro Premium</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {user?.id === "mock-temporario" ? (
                      <div className="p-4 bg-brand-red/5 rounded-2xl mb-2 border border-brand-red/10 group">
                        <p className="text-[10px] font-black text-brand-red uppercase tracking-wider mb-3">Modo Visitante</p>
                        <button
                          onClick={() => { router.push("/signup"); setDropdownOpen(false); }}
                          className="w-full py-3 bg-brand-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-red/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                          Criar Conta Agora
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { router.push("/estudio/configuracoes-da-conta"); setDropdownOpen(false); }}
                        className="w-full text-left px-5 py-3.5 text-[13px] font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Settings size={18} />
                        </div>
                        Configurações
                      </button>
                    )}

                    <a
                      href={supportLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-5 py-3.5 text-[13px] font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle size={18} className="text-emerald-500" />
                      </div>
                      Suporte VIP WhatsApp
                    </a>

                    <div className="h-px bg-white/5 mx-3 my-2" />

                    {user?.id === "mock-temporario" ? (
                      <button
                        onClick={() => { router.push("/login"); setDropdownOpen(false); }}
                        className="w-full text-left px-5 py-3.5 text-[13px] font-black text-white hover:bg-white/5 rounded-2xl transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogIn size={18} className="text-brand-orange" />
                        </div>
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
                        className="w-full text-left px-5 py-3.5 text-[13px] font-black text-brand-red hover:bg-brand-red/5 rounded-2xl transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogOut size={18} />
                        </div>
                        Sair da Conta
                      </button>
                    )}
                  </div>
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
