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
        className="hidden md:flex flex-col fixed h-screen z-40 bg-white border-r border-[#EAEAEC] select-none"
        suppressHydrationWarning
      >
        {/* Logo */}
        <div className="flex items-center justify-center border-b border-[#EAEAEC] h-28 px-4" suppressHydrationWarning>
          <Link href="/estudio" className="flex items-center shrink-0">
            {sidebarCollapsed ? (
              <img
                src={LOGO_PEPPER}
                alt="Estúdio & Sabor"
                className="w-14 h-14 object-contain"
              />
            ) : (
              <img
                src={LOGO_LIGHT_BG}
                alt="Estúdio & Sabor"
                className="h-20 w-auto object-contain"
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide" suppressHydrationWarning>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className={cn(sIdx > 0 && "mt-4")} suppressHydrationWarning>
              {/* Section Label */}
              <AnimatePresence>
                {section.label && !sidebarCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-5 mb-2 text-[10px] font-bold text-[#A6A6A6] uppercase tracking-[0.15em]"
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Section Items */}
              <div className={cn("flex flex-col gap-0.5", sidebarCollapsed ? "px-2" : "px-3")} suppressHydrationWarning>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden group",
                        sidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                        isActive
                          ? "text-white"
                          : "text-[#717171] hover:text-[#3E3E3E] hover:bg-[#F7F7F7]",
                        item.highlight && !isActive && "text-pepper-red"
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn(
                          "shrink-0 relative z-10 transition-colors",
                          isActive ? "text-white" : "",
                          item.highlight && !isActive && "text-pepper-red"
                        )}
                      />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="relative z-10 whitespace-nowrap overflow-hidden"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active indicator pill */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-[#EA1D2C] rounded-xl"
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className={cn("border-t border-[#EAEAEC] py-3 flex flex-col gap-0.5", sidebarCollapsed ? "px-2" : "px-3")} suppressHydrationWarning>
          <Link
            href="/estudio/configuracoes-da-conta"
            title={sidebarCollapsed ? "Configurações" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl text-sm font-medium text-[#717171] hover:text-[#3E3E3E] hover:bg-[#F7F7F7] transition-all",
              sidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"
            )}
          >
            <Settings size={18} className="shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
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
                "flex items-center gap-3 rounded-xl text-sm font-bold text-white bg-[#EA1D2C] hover:bg-[#d1192a] transition-all",
                sidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"
              )}
            >
              <Shield size={18} className="shrink-0" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
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
                "flex items-center gap-3 rounded-xl text-sm font-medium text-[#717171] hover:text-[#EA1D2C] hover:bg-red-50 transition-all w-full text-left",
                sidebarCollapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"
              )}
            >
              <LogOut size={18} className="shrink-0" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Sair
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#EAEAEC] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F7F7F7] transition-colors z-50"
          aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {sidebarCollapsed ? <ChevronRight size={12} className="text-[#717171]" /> : <ChevronLeft size={12} className="text-[#717171]" />}
        </button>
      </motion.aside>

      {/* Mobile Bottom Bar - compact and functional */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EAEAEC] safe-area-bottom">
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
                  isActive ? "text-[#EA1D2C]" : "text-[#A6A6A6]"
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
