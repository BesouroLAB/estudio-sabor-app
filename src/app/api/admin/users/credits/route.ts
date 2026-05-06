import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminSupabase } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, amount } = body;

  if (!userId || typeof amount !== "number" || amount === 0) {
    return NextResponse.json(
      { error: "userId and a non-zero amount are required" },
      { status: 400 }
    );
  }

  // Usar service role para bypass RLS — admin atualiza créditos de qualquer usuário
  const supabase = getAdminSupabase();

  // Get current credits
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits, email, full_name")
    .eq("id", userId)
    .single();

  if (fetchError || !profile) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const currentCredits = profile.credits ?? 0;
  const newCredits = Math.max(0, currentCredits + amount);

  // Update credits
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: newCredits })
    .eq("id", userId);

  if (updateError) {
    console.error("❌ Admin credit update failed:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Log Transaction
  await supabase.from("credit_transactions").insert({
    user_id: userId,
    amount: amount,
    type: "admin_adjustment",
    package_name: `Ajuste Admin (${admin.email})`,
    full_name: profile.full_name || "Unknown User",
    reference_id: `adm_${Date.now()}_${userId.slice(0, 4)}`
  });

  console.log(
    `🔧 Admin ${admin.email} adjusted credits for ${profile.email}: ${currentCredits} → ${newCredits} (${amount > 0 ? "+" : ""}${amount})`
  );

  return NextResponse.json({
    success: true,
    userId,
    previousCredits: currentCredits,
    newCredits,
    adjustment: amount,
  });
}
