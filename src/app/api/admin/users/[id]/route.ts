import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminSupabase } from "@/lib/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const { id } = await params;
    const { credits, role } = await req.json();

    const supabase = getAdminSupabase();

    const updates: any = {};
    if (typeof credits === 'number') updates.credits = credits;
    if (role) updates.role = role;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log the transaction if credits changed
    if (typeof credits === 'number') {
      await supabase.from("credit_transactions").insert({
        user_id: id,
        amount: credits,
        type: credits > 0 ? "admin_adjustment" : "admin_adjustment",
        package_name: `Ajuste Admin (${admin.email})`,
        reference_id: `adm_patch_${Date.now()}_${id.slice(0, 4)}`
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const { id } = await params;
    const supabase = getAdminSupabase();

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
