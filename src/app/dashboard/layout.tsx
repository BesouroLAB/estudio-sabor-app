import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShellClient } from "@/components/dashboard/DashboardShellClient";
import { DashboardProvider } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isMock = !user;
  
  let credits = 30;
  let userName = "Visitante (Mock)";
  let isAdmin = false;

  if (!isMock) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits, full_name, role")
      .eq("id", user.id)
      .single();
    
    credits = profile?.credits ?? 0;
    userName = profile?.full_name ?? undefined;
    isAdmin = profile?.role === "admin";
  }

  const { data: settings } = await supabase
    .from('system_settings')
    .select('key, value')
    .in('key', ['whatsapp_support_link', 'global_announcement']);

  const supportLink = settings?.find(s => s.key === 'whatsapp_support_link')?.value as string || 'https://wa.me/5516988031505';
  const announcement = settings?.find(s => s.key === 'global_announcement')?.value as any || null;
  
  return (
    <DashboardProvider>
      <div className="flex h-screen bg-[#F7F7F7] relative overflow-hidden">
        <DashboardSidebar isAdmin={isAdmin} />
        
        <DashboardShellClient>
           <DashboardHeader 
             user={user || { id: 'mock', email: 'visitante@mock.com' } as any} 
             credits={credits} 
             userName={userName}
             supportLink={supportLink}
             announcement={announcement}
           />

           <div className="flex-1 overflow-y-auto">
              {children}
           </div>
        </DashboardShellClient>
      </div>
    </DashboardProvider>
  );
}
