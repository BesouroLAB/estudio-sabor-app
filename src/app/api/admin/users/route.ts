import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminSupabase } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    // Usar service role para bypass RLS — admin precisa ver TODOS os profiles
    const adminDb = getAdminSupabase();

    const { data: users, error } = await adminDb
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("❌ Admin users GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const body = await req.json();
    const { userId, ...updates } = body;

    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const adminDb = getAdminSupabase();
    
    const { data, error } = await adminDb
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ Admin users PATCH error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const adminDb = getAdminSupabase();

    // Nota: Deletar um profile pode exigir deletar o auth.user também se quiser limpeza total,
    // mas por enquanto focamos no profile do CRM.
    const { error } = await adminDb
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Admin users DELETE error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
