import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "../DashboardClient"; // Reusing the wizard but starting at 'upload'

export default async function CreateKitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle Mock or Auth
  let currentUser = user;
  if (!currentUser) {
     currentUser = {
      id: "mock-temporario",
      email: "mock@teste.com",
    } as any;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, full_name")
    .eq("id", currentUser!.id)
    .single();

  const creditsRemaining = profile?.credits ?? 30;
  const userName = profile?.full_name ?? "Visitante";

  return (
    <div className="flex-1 flex flex-col">
       <DashboardClient 
         user={currentUser!} 
         initialCredits={creditsRemaining} 
         userName={userName}
         initialStep="upload" // We tell the component to start at upload
       />
    </div>
  );
}
