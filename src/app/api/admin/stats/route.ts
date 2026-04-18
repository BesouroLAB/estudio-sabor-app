import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = await createClient();

  // All queries in parallel
  const [
    usersResult,
    totalCallsResult,
    todayCallsResult,
    callsByTypeResult,
    costsResult,
    dailyCallsResult,
    exchangeResult,
    generationStatsResult, // New: for download rate
    circuitBreakerResult, // New: for budget safety
  ] = await Promise.all([
    // Total users
    supabase.from("profiles").select("id", { count: "exact", head: true }),

    // Total API calls
    supabase.from("api_usage").select("id", { count: "exact", head: true }),

    // Calls today
    supabase
      .from("api_usage")
      .select("id, cost_brl", { count: "exact" })
      .gte("created_at", new Date().toISOString().split("T")[0]),

    // Calls by type
    supabase.from("api_usage").select("call_type"),

    // Total costs
    supabase.from("api_usage").select("cost_usd, cost_brl"),

    // Daily calls (last 30 days)
    supabase
      .from("api_usage")
      .select("call_type, created_at")
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      )
      .order("created_at", { ascending: true }),

    // Latest exchange rate
    supabase
      .from("exchange_rates")
      .select("rate, fetched_at")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single(),

    // Generation telemetry (Download Rate)
    supabase
      .from("api_usage")
      .select("id, downloaded_at")
      .eq("call_type", "image_generation"),

    // Circuit Breaker Settings
    supabase
      .from("settings")
      .select("daily_budget_brl, is_safe_mode")
      .eq("id", "global")
      .single(),
  ]);

  // Calculate calls by type
  const callsByType: Record<string, number> = {};
  if (callsByTypeResult.data) {
    for (const row of callsByTypeResult.data) {
      callsByType[row.call_type] = (callsByType[row.call_type] || 0) + 1;
    }
  }

  // Calculate download rate
  let downloadRate = 0;
  if (generationStatsResult.data && generationStatsResult.data.length > 0) {
    const totalGen = generationStatsResult.data.length;
    const downloaded = generationStatsResult.data.filter(g => g.downloaded_at).length;
    downloadRate = (downloaded / totalGen) * 100;
  }

  // Today's spending
  const spentToday = (todayCallsResult.data || []).reduce(
    (acc, curr) => acc + (Number(curr.cost_brl) || 0), 0
  );

  // Calculate total costs
  let totalCostUsd = 0;
  let totalCostBrl = 0;
  if (costsResult.data) {
    for (const row of costsResult.data) {
      totalCostUsd += Number(row.cost_usd) || 0;
      totalCostBrl += Number(row.cost_brl) || 0;
    }
  }

  // Build daily calls aggregation
  const dailyMap: Record<string, { image_generation: number; copywriting: number }> = {};
  if (dailyCallsResult.data) {
    for (const row of dailyCallsResult.data) {
      const day = row.created_at.split("T")[0];
      if (!dailyMap[day]) {
        dailyMap[day] = { image_generation: 0, copywriting: 0 };
      }
      if (row.call_type === "image_generation") {
        dailyMap[day].image_generation++;
      } else {
        dailyMap[day].copywriting++;
      }
    }
  }

  const dailyCalls = Object.entries(dailyMap).map(([date, counts]) => ({
    date,
    ...counts,
  }));

  return NextResponse.json({
    totalUsers: usersResult.count || 0,
    totalCalls: totalCallsResult.count || 0,
    callsToday: todayCallsResult.count || 0,
    callsByType,
    totalCostUsd,
    totalCostBrl,
    downloadRate,
    spentToday,
    dailyBudget: circuitBreakerResult.data?.daily_budget_brl || 30.00,
    isSafeMode: circuitBreakerResult.data?.is_safe_mode ?? true,
    exchangeRate: exchangeResult.data?.rate
      ? Number(exchangeResult.data.rate)
      : 5.5,
    dailyCalls,
  });
}
