"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DashboardContextType {
  title: string;
  setTitle: (title: string) => void;
  showProgress: boolean;
  setShowProgress: (show: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  stepsCount: number;
  setStepsCount: (count: number) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  userCredits: number;
  setUserCredits: (credits: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("Início");
  const [showProgress, setShowProgress] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepsCount, setStepsCount] = useState(5);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userCredits, setUserCredits] = useState(0);

  // Persist sidebar preference
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setSidebarCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <DashboardContext.Provider value={{
      title, setTitle,
      showProgress, setShowProgress,
      currentIndex, setCurrentIndex,
      stepsCount, setStepsCount,
      sidebarCollapsed, toggleSidebar,
      userCredits, setUserCredits
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
