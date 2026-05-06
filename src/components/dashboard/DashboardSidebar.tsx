"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusSquare,
  LayoutTemplate,
  History,
  CreditCard,
  ShoppingBag,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useDashboard } from "@/context/DashboardContext";

const LOGO_LIGHT_BG =
  "https://res.cloudinary.com/do8gdtozt/image/upload/v1761865865/logo_estudio_sabor_horizontal-upscale-scale-6_00x_nmbn9t.png";
const LOGO_PEPPER =
  "https://res.cloudinary.com/do8gdtozt/image/upload/f_auto,q_auto/v1761782366/pimenta_sem__fundo_qur83u.png";

const navSections = [
  {
    label: null,
    items: [
      { name: "Estúdio de Criação", href: "/estudio", icon: PlusSquare, highlight: true },
    ],
  },
  {
    label: "Meus Dados",
    items: [
      { name: "Minhas Criações", href: "/estudio/minhas-criacoes", icon: History },
      { name: "Templates & Promos", href: "/estudio/templates-de-venda", icon: LayoutTemplate },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { name: "Extrato de Créditos", href: "/estudio/extrato-de-creditos", icon: CreditCard },
      { name: "Loja de Créditos", href: "/estudio/loja-de-creditos", icon: ShoppingBag },
    ],
  },
];

interface DashboardSidebarProps {
  isAdmin?: boolean;
  isVisitor?: boolean;
}

export function DashboardSidebar({ isAdmin = false, isVisitor = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useDashboard();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col fixed h-screen z-40 bg-brand-dark border-r border-white/5 select-none relative"
        suppressHydrationWarning
      >
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-0 w-full h-32 bg-brand-red/5 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center justify-center border-b border-white/5 h-28 px-4 relative z-10" suppressHydrationWarning>
          <Link href="/estudio" className="flex items-center shrink-0 transition-transform active:scale-95 group">
            {sidebarCollapsed ? (
              <img
                src={LOGO_PEPPER}
                alt="Estúdio & Sabor"
                className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(255,0,46,0.3)] transition-all group-hover:drop-shadow-[0_0_12px_rgba(255,0,46,0.5)]"
              />
            ) : (
              <img
                src={LOGO_LIGHT_BG}
                alt="Estúdio & Sabor"
                className="h-16 w-auto object-contain transition-all group-hover:brightness-110"
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide relative z-10" suppressHydrationWarning>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className={cn(sIdx > 0 && "mt-8")} suppressHydrationWarning>
              {/* Section Label */}
              <AnimatePresence mode="wait">
                {section.label && !sidebarCollapsed && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="px-6 mb-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]"
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Section Items */}
              <div className={cn("flex flex-col gap-1", sidebarCollapsed ? "px-2" : "px-3")} suppressHydrationWarning>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl text-[13px] font-bold transition-all relative overflow-hidden group",
                        sidebarCollapsed ? "justify-center px-0 py-3.5" : "px-4 py-3",
                        isActive
                          ? "text-white shadow-[0_0_20px_rgba(255,0,46,0.15)]"
                          : "text-white/40 hover:text-white hover:bg-white/5",
                        (item as any).highlight && !isActive && "text-brand-orange"
                      )}
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn(
                          "shrink-0 relative z-10 transition-all",
                          isActive ? "text-white scale-110" : "group-hover:scale-110",
                          (item as any).highlight && !isActive && "text-brand-orange"
                        )}
                      />
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            className="relative z-10 whitespace-nowrap overflow-hidden tracking-tight"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active indicator pill with gradient and glow */}
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute inset-0 bg-brand-gradient"
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                          />
                          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className={cn("border-t border-white/5 py-4 flex flex-col gap-1 relative z-10", sidebarCollapsed ? "px-2" : "px-3")} suppressHydrationWarning>
          <Link
            href="/estudio/configuracoes-da-conta"
            title={sidebarCollapsed ? "Configurações" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl text-[13px] font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all group",
              sidebarCollapsed ? "justify-center px-0 py-3.5" : "px-4 py-3"
            )}
          >
            <Settings size={18} className="shrink-0 transition-transform group-hover:rotate-45" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap tracking-tight"
                >
                  Configurações
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              title={sidebarCollapsed ? "Painel Admin" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl text-[13px] font-black text-white bg-white/5 border border-white/10 hover:bg-brand-red transition-all group shadow-lg shadow-black/20",
                sidebarCollapsed ? "justify-center px-0 py-3.5" : "px-4 py-3"
              )}
            >
              <Shield size={18} className="shrink-0 transition-transform group-hover:scale-110" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap tracking-tight uppercase"
                  >
                    Painel Admin
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {!isVisitor && (
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              title={sidebarCollapsed ? "Sair" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl text-[13px] font-bold text-white/40 hover:text-brand-red hover:bg-brand-red/5 transition-all w-full text-left group",
                sidebarCollapsed ? "justify-center px-0 py-3.5" : "px-4 py-3"
              )}
            >
              <LogOut size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap tracking-tight"
                  >
                    Sair da Conta
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-32 w-6 h-6 bg-brand-surface border border-white/10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:bg-white/10 transition-all z-50 text-white active:scale-90"
          aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>


      {/* Mobile Bottom Bar - compact and functional */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-dark border-t border-white/5 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-1" suppressHydrationWarning>
          {[
            { name: "Estúdio", href: "/estudio", icon: PlusSquare },
            { name: "Projetos", href: "/estudio/minhas-criacoes", icon: History },
            { name: "Loja", href: "/estudio/loja-de-creditos", icon: ShoppingBag },
            { name: "Config", href: "/estudio/configuracoes-da-conta", icon: Settings },
          ].map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                  isActive ? "text-brand-red" : "text-slate-500"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
