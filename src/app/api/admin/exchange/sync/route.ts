import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

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
    const { error } = await supabase.from("exchange_rates").insert({
      currency_pair: "USD-BRL",
      rate: rate,
    });

    if (error) throw error;

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
