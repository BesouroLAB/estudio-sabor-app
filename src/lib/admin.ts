import { createClient } from "@/lib/supabase/server";

/**
 * Checks if the current user is an admin.
 * Returns the user object if admin, null otherwise.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") return null;

  return user;
}

/**
 * Creates a Supabase client with the Service Role key to bypass RLS.
 * **DANGER:** Only use in secure server routes (e.g. Webhooks).
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // Must set this in .env
  
  if (!url || !key) {
    throw new Error("Missing Supabase Service Role configuration");
  }

  return createSupabaseClient(url, key);
}
