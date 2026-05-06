import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShellClient } from "@/components/dashboard/DashboardShellClient";
import { DashboardProvider } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  
  let credits = isMock ? 30 : 0; // 30 créditos demo para visitantes
  let userName = "Visitante";
  let isAdmin = false;

  if (!isMock) {
    // Busca do perfil
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();
    
    if (profileError) {
      console.warn("⚠️ DashboardLayout Error:", profileError.message);
    }

    console.log("🔍 [Dashboard] Profile Object:", JSON.stringify(profile, null, 2));
    
    credits = profile?.credits ?? 0;
    
    // Fallback inteligente para o nome: Profile > Email Prefix > Usuário
    const emailPrefix = user.email?.split("@")[0] || "";
    const formattedEmailPrefix = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    
    userName = profile?.full_name || formattedEmailPrefix || "Usuário";
    
    // Verificação robusta de admin (e-mail ou role)
    const isAdminEmail = user.email?.toLowerCase().includes("tiagofernand9s") || 
                         user.email?.toLowerCase().includes("besourolab");
    
    isAdmin = profile?.role === "admin" || isAdminEmail;
  }

  const { data: settings } = await supabase
    .from('system_settings')
    .select('key, value')
    .in('key', ['whatsapp_support_link', 'global_announcement']);

  const supportLink = settings?.find(s => s.key === 'whatsapp_support_link')?.value as string || 'https://wa.me/5516988031505';
  const announcement = settings?.find(s => s.key === 'global_announcement')?.value as any || null;
  
  return (
    <DashboardProvider initialCredits={credits} userId={user?.id}>
      <div className="flex h-screen bg-[#F7F7F7] relative overflow-hidden" suppressHydrationWarning>
        <DashboardSidebar isAdmin={isAdmin} isVisitor={isMock} />
        
        <DashboardShellClient>
           <DashboardHeader 
             user={user || { id: 'mock', email: 'visitante@mock.com' } as any} 
             credits={credits} 
             userName={userName}
             supportLink={supportLink}
             announcement={announcement}
           />

           <div className="flex-1 overflow-y-auto" suppressHydrationWarning>
              {children}
           </div>
        </DashboardShellClient>
      </div>
    </DashboardProvider>
  );
}
