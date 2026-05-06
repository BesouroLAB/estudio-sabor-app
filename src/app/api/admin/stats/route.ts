import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminSupabase } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Usar service role para bypass RLS — admin precisa ver dados de TODOS os usuários
    const supabase = getAdminSupabase();

    // 1. Time bounds
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    // 2. Main Data Fetching
    const [
      { count: totalUsers },
      { data: allProfiles },
      { data: revenueData },
      { data: allCostData },
      { data: todayCostData },
      { data: usageDistribution },
      { data: dailyData },
      { data: exchangeRateSetting },
      { data: allProfilesWithTiers }
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("credits"),
      supabase.from("credit_transactions").select("amount_paid_brl").eq("type", "purchase"),
      supabase.from("credit_transactions").select("cost_brl").not("cost_brl", "is", null),
      supabase.from("credit_transactions").select("cost_brl").gte("created_at", todayISO).not("cost_brl", "is", null),
      supabase.from("credit_transactions").select("type").neq("type", "purchase"),
      supabase.from("credit_transactions").select("type, created_at").gte("created_at", thirtyDaysAgoISO).neq("type", "purchase"),
      supabase.from("system_settings").select("value, updated_at").eq("key", "usd_brl_rate").single(),
      supabase.from("profiles").select("current_tier")
    ]);

    // Group Tiers Distribution
    const tiersDistribution: Record<string, number> = { "Free": 0, "Starter": 0, "Pro": 0 };
    (allProfilesWithTiers || []).forEach(p => {
      const tier = p.current_tier || "Free";
      tiersDistribution[tier] = (tiersDistribution[tier] || 0) + 1;
    });

    // 2.1 Auto-sync Exchange Rate if older than 24h
    let currentRate = parseFloat(exchangeRateSetting?.value || "5.50");
    const lastUpdate = exchangeRateSetting?.updated_at ? new Date(exchangeRateSetting.updated_at) : new Date(0);
    const hoursSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceUpdate >= 24) {
      console.log(`🔄 Exchange rate is stale (${hoursSinceUpdate.toFixed(1)}h). Syncing...`);
      // We don't await this to keep the API fast, it will update for the next request
      import("@/lib/services/exchange-rate").then(m => m.syncExchangeRate()).catch(console.error);
    }

    // 3. Calculations
    const totalCredits = (allProfiles || []).reduce((acc, curr) => acc + (curr.credits || 0), 0);
    const totalRevenue = (revenueData || []).reduce((acc, curr) => acc + (Number(curr.amount_paid_brl) || 0), 0);
    const totalApiCost = (allCostData || []).reduce((acc, curr) => acc + (Number(curr.cost_brl) || 0), 0);
    const spentToday = (todayCostData || []).reduce((acc, curr) => acc + (Number(curr.cost_brl) || 0), 0);
    
    // Usage Distribution
    const callsByType: Record<string, number> = {};
    (usageDistribution || []).forEach(tx => {
      callsByType[tx.type] = (callsByType[tx.type] || 0) + 1;
    });

    const totalCalls = (usageDistribution || []).length;
    const callsToday = (todayCostData || []).length;

    // Daily Calls (last 30 days)
    const dailyCallsMap: Record<string, { date: string; image_generation: number; copywriting: number }> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      dailyCallsMap[ds] = { date: ds, image_generation: 0, copywriting: 0 };
    }

    (dailyData || []).forEach(tx => {
      const ds = tx.created_at.split('T')[0];
      if (dailyCallsMap[ds]) {
        if (tx.type === 'image_generation' || tx.type === 'kit_creation') {
          dailyCallsMap[ds].image_generation++;
        } else {
          dailyCallsMap[ds].copywriting++;
        }
      }
    });

    const dailyCalls = Object.values(dailyCallsMap).sort((a, b) => a.date.localeCompare(b.date));

    // Get daily budget from settings or fallback
    const { data: budgetSetting } = await supabase.from("system_settings").select("value").eq("key", "daily_cost_budget").single();
    const dailyBudget = parseFloat(budgetSetting?.value || "50");

    // 4. Final Response
    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalCredits,
        totalRevenue,
        totalApiCost,
        profit: totalRevenue - totalApiCost,
        spentToday,
        dailyBudget,
        callsToday,
        totalCalls,
        callsByType,
        dailyCalls,
        tiersDistribution,
        downloadRate: 85, // Mocked for now until we track downloads
        exchangeRate: currentRate
      }
    });

  } catch (error: any) {
    console.error("[Admin Stats API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
