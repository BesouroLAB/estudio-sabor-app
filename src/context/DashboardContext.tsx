"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";

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

export function DashboardProvider({ 
  children,
  initialCredits = 0,
  userId
}: { 
  children: ReactNode;
  initialCredits?: number;
  userId?: string;
}) {
  const [title, setTitle] = useState("Início");
  const [showProgress, setShowProgress] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepsCount, setStepsCount] = useState(5);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userCredits, setUserCredits] = useState(initialCredits);
  
  // Sync context state with server-provided initial credits
  useEffect(() => {
    setUserCredits(initialCredits);
  }, [initialCredits]);

  // Supabase Realtime Subscription for Credits
  useEffect(() => {
    if (!userId || userId === 'mock') return;

    const supabase = createClient();
    
    // Subscribe to changes in the current user's profile
    const channel = supabase
      .channel(`profile_changes_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload: RealtimePostgresUpdatePayload<any>) => {
          if (payload.new && typeof payload.new.credits === 'number') {
            console.log("🔄 Realtime credit update detected:", payload.new.credits);
            setUserCredits(payload.new.credits);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

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
