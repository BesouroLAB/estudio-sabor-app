import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  return GET();
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL", {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch from AwesomeAPI");

    const data = await response.json();
    const rate = parseFloat(data.USDBRL.bid);

    const supabase = await createClient();
    
    // History
    await supabase.from("exchange_rates").insert({
      currency_pair: "USD-BRL",
      rate: rate,
    });

    // Global Settings
    await supabase.from("system_settings").upsert({
      key: "usd_brl_rate",
      value: rate,
      description: "Taxa de câmbio USD para BRL para cálculo de custos de API (Sync Automático)",
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });

    return NextResponse.json({
      success: true,
      rate: rate,
      timestamp: data.USDBRL.create_date,
    });
  } catch (error: any) {
    console.error("❌ Exchange sync failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sync exchange rate" },
      { status: 500 }
    );
  }
}
