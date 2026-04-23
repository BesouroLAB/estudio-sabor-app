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
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Início", href: "/dashboard", icon: Home },
  { name: "Criar Kit Mágico", href: "/dashboard/create", icon: PlusSquare, highlight: true },
  { name: "Meus Projetos", href: "/dashboard/history", icon: History },
  { name: "Templates & Promos", href: "/dashboard/templates", icon: LayoutTemplate },
  { name: "Extrato de Créditos", href: "/dashboard/balance", icon: CreditCard },
  { name: "Loja de Créditos", href: "/dashboard/store", icon: ShoppingBag },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg-surface fixed h-screen z-40">
      <div className="px-2 py-12">
        <Link href="/dashboard" className="flex items-center group">
          <img 
            src="https://res.cloudinary.com/do8gdtozt/image/upload/v1761865865/logo_estudio_sabor_horizontal-upscale-scale-6_00x_nmbn9t.png" 
            alt="Estúdio & Sabor" 
            className="w-full h-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                isActive 
                  ? "text-white shadow-md shadow-pepper-orange/20" 
                  : "text-text-muted hover:text-text-primary hover:bg-bg-elevated/50",
                item.highlight && !isActive && "text-pepper-orange bg-pepper-orange/5"
              )}
            >
              <Icon size={18} className={cn(
                "transition-colors relative z-10",
                isActive ? "text-white" : "group-hover:text-pepper-orange",
                item.highlight && !isActive && "text-pepper-orange"
              )} />
              <span className="relative z-10">{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill-bg"
                  className="absolute inset-0 bg-gradient-to-r from-pepper-red to-pepper-orange rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex flex-col gap-1">
        <Link 
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
        >
          <Settings size={18} />
          Configurações
        </Link>
        <button 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-red-500 hover:bg-red-50 transition-all w-full text-left"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
