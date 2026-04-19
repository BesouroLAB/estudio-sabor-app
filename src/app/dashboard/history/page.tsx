import { createClient } from "@/lib/supabase/server";
import { HistoryView } from "@/components/views/HistoryView";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle Mock
  let currentUser = user;
  if (!currentUser) {
     currentUser = {
      id: "mock-temporario",
      email: "mock@teste.com",
    } as any;
  }

  // Fetch real creations from Supabase
  const { data: creations, error } = await supabase
    .from("creations")
    .select("*")
    .eq("user_id", currentUser!.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching creations:", error);
  }

  return (
    <HistoryView creations={creations || []} />
  );
}
