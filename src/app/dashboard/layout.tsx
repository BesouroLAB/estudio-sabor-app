import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardProvider } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não houver usuário real, usamos o mock para o dashboard não quebrar em dev
  const isMock = !user;
  
  let credits = 30;
  let userName = "Visitante (Mock)";

  if (!isMock) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits, full_name")
      .eq("id", user.id)
      .single();
    
    credits = profile?.credits ?? 0;
    userName = profile?.full_name ?? undefined;
  }
  
  return (
    <DashboardProvider>
      <div className="flex h-screen bg-bg-main relative overflow-hidden selection:bg-pepper-red/30">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pepper-red/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pepper-orange/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Sidebar - Fixed/Software style */}
        <DashboardSidebar />
        
        {/* Main Software Canvas */}
        <main className="flex-1 flex flex-col min-w-0 md:pl-64 h-full relative overflow-hidden">
           {/* Universal Header - FIXED at the top of the content area */}
           <DashboardHeader 
             user={user || { id: 'mock', email: 'visitante@mock.com' } as any} 
             credits={credits} 
             userName={userName}
           />

           {/* Internal content area (Scrollable Canvas) */}
           <div className="flex-1 overflow-y-auto relative">
              {children}
           </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
