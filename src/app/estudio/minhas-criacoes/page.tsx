import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HistoryView } from "@/components/views/HistoryView";

export default async function HistoryPage() {
  const supabase = await createClient();
  let {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // TEMPORARY: Mock user (consistent with main dashboard)
    user = {
      id: "mock-temporario",
      email: "mock@teste.com",
    } as any;
  }

  const currentUser = user!;
  let creations = [];

  if (currentUser.id !== "mock-temporario") {
    // Fetch real creations from Supabase
    const { data, error } = await supabase
      .from("creations")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching creations:", error);
    } else {
      creations = data || [];
    }
  }


  return (
    <HistoryView creations={creations || []} />
  );
}
