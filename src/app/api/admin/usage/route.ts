import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminSupabase } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const callType = searchParams.get("callType") || "";
  const userEmail = searchParams.get("userEmail") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  // Usar service role para ver TODOS os registros de uso
  const supabase = getAdminSupabase();

  let query = supabase
    .from("api_usage")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (callType) {
    query = query.eq("call_type", callType);
  }

  if (userEmail) {
    query = query.ilike("user_email", `%${userEmail}%`);
  }

  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }

  if (dateTo) {
    query = query.lte("created_at", `${dateTo}T23:59:59`);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("❌ Admin usage query failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    usage: data || [],
    total: count || 0,
    page,
    limit,
  });
}
