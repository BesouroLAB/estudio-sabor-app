import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  let {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // TEMPORARY: Mock user
    user = {
      id: "mock-temporario",
      email: "mock@teste.com",
    } as any;
  }

  let creditsRemaining = 0;
  let userName = "Visitante (Mock)";

  if (user?.id !== "mock-temporario") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits, full_name")
      .eq("id", user!.id)
      .single();
    
    creditsRemaining = profile?.credits ?? 0;
    userName = profile?.full_name ?? undefined;
  } else {
    // Tem 30 créditos para testarmos as coisas
    creditsRemaining = 30;
  }

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8">Carregando...</div>}>
      <DashboardClient 
        user={user!}
        initialCredits={creditsRemaining}
        userName={userName}
        initialStep="hub"
      />
    </Suspense>
  );
}
