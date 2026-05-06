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

  if (!user) {
    console.error("❌ requireAdmin: No authenticated user found");
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("❌ requireAdmin: Failed to fetch profile:", error.message);
  }

  // Verificação por role OU por email (fallback robusto)
  const isAdminByRole = profile?.role === "admin";
  const isAdminByEmail = user.email?.includes("tiagofernand9s") || user.email?.includes("besourolab");
  
  if (!isAdminByRole && !isAdminByEmail) {
    console.error(`❌ requireAdmin: Access denied for ${user.email} (role: ${profile?.role})`);
    return null;
  }

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
