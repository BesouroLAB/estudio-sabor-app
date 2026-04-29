"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";

export function DashboardShellClient({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useDashboard();

  return (
    <motion.main
      animate={{ paddingLeft: sidebarCollapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex-1 flex flex-col min-w-0 h-full relative md:pl-60"
    >
      {children}
    </motion.main>
  );
}
