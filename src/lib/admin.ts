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
