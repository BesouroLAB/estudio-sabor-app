"use client";

import { motion } from "framer-motion";
import { Sparkles, User as UserIcon, LogOut, RotateCcw, Flame, MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useDashboard } from "@/context/DashboardContext";

interface DashboardHeaderProps {
  user: User;
  credits: number;
  userName?: string;
  supportLink?: string;
  announcement?: { active: boolean; message: string; type: string } | null;
}

export function DashboardHeader({ 
  user, 
  credits, 
  userName,
  supportLink = "https://wa.me/5516988031505",
  announcement
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { title, showProgress, currentIndex, stepsCount } = useDashboard();

  // Determinar rótulo contextual se não for passado explicitamente via contexto
  const getContextLabel = () => {
    if (title && title !== 'Início') return title;
    if (pathname.includes('/store')) return 'Loja de Créditos';
    if (pathname.includes('/balance')) return 'Extrato de Créditos';
    if (pathname.includes('/history')) return 'Galeria de Projetos';
    if (pathname.includes('/settings')) return 'Configurações';
    return 'Início';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Contextual Info */}
        <div className="flex items-center gap-4">
          {showProgress ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 group focus-ring rounded-lg shrink-0"
              aria-label="Voltar"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pepper-red to-pepper-orange flex items-center justify-center shadow-lg shadow-pepper-red/15 transition-transform group-hover:scale-105 active:scale-95">
                <Flame size={20} className="text-white" />
              </div>
            </button>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Painel</span>
              <span className="text-sm font-bold text-text-primary capitalize">{getContextLabel()}</span>
            </div>
          )}

          {/* Step Indicator (Only during active creation) */}
          {showProgress && (
            <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4">
              {Array.from({ length: stepsCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i <= currentIndex
                        ? "bg-gradient-to-r from-pepper-red to-pepper-orange w-8"
                        : "bg-border-default w-6"
                    }`}
                    layout
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: User Menu & Stats */}
        <div className="flex items-center gap-4">
          {/* Credits Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pepper-orange/[0.08] border border-pepper-orange/10 cursor-help"
            title="Seu saldo de kits mágicos"
          >
            <div className="relative">
              <Sparkles size={14} className="text-pepper-orange" />
              <div className="absolute inset-0 animate-ping bg-pepper-orange/40 rounded-full scale-150 blur-sm"></div>
            </div>
            <span className="text-xs font-bold text-pepper-orange">
              {credits} <span className="opacity-70 font-medium">Kits</span>
            </span>
          </motion.div>

          <div className="h-8 w-px bg-bg-elevated mx-1 hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-text-primary line-clamp-1">
                {userName || user.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-text-muted">Membro Premium</span>
            </div>
            
            <div className="relative group">
              <div className="w-9 h-9 rounded-xl bg-bg-elevated flex items-center justify-center transition-all group-hover:shadow-soft cursor-pointer relative">
                <UserIcon size={18} className="text-text-secondary group-hover:text-pepper-orange transition-colors" />
                {user.id === 'mock-temporario' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-pepper-red rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all p-2 z-[60] border border-border-subtle">
                {user.id === 'mock-temporario' ? (
                  <div className="p-3 bg-pepper-red/5 rounded-xl mb-2 border border-pepper-red/10">
                    <p className="text-[10px] font-black text-pepper-red uppercase tracking-widest mb-2">Modo Visitante</p>
                    <p className="text-[10px] text-text-muted leading-tight mb-3">Crie uma conta para salvar suas criações permanentemente.</p>
                    <button 
                      onClick={() => router.push('/signup')}
                      className="w-full py-2 bg-pepper-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-pepper-black transition-colors"
                    >
                      Criar Conta Agora
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="px-3 py-2 text-[10px] uppercase font-bold text-text-muted tracking-wider">Gestão</p>
                    <button 
                      onClick={() => router.push('/dashboard/settings')}
                      className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-main rounded-xl transition-colors flex items-center justify-between group/item"
                    >
                      Configurações <RotateCcw size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                  </>
                )}
                
                <a 
                  href={supportLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-main rounded-xl transition-colors flex items-center justify-between group/item"
                >
                  Suporte WhatsApp <MessageCircle size={14} className="text-pepper-orange" />
                </a>
                
                <div className="h-px bg-border-subtle my-1" />
                
                {user.id === 'mock-temporario' ? (
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-main rounded-xl transition-colors flex items-center justify-between"
                  >
                    Fazer Login <LogOut size={14} />
                  </button>
                ) : (
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full text-left px-3 py-2 text-sm text-pepper-red hover:bg-pepper-red/[0.04] rounded-xl transition-colors flex items-center justify-between group/logout"
                    >
                      Sair da conta <LogOut size={14} className="group-hover/logout:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
