import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createSupabaseAdmin(supabaseUrl, supabaseAnonKey)
    : null;

const CACHE_HOURS = 24;

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ rate: 5.5, source: "fallback" });
  }

  try {
    // Check cache first
    const cutoff = new Date(
      Date.now() - CACHE_HOURS * 60 * 60 * 1000
    ).toISOString();

    const { data: cached } = await supabase
      .from("exchange_rates")
      .select("rate, fetched_at")
      .eq("currency_pair", "USD-BRL")
      .gte("fetched_at", cutoff)
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    if (cached) {
      return NextResponse.json({
        rate: Number(cached.rate),
        source: "cache",
        fetchedAt: cached.fetched_at,
      });
    }

    // Fetch fresh from AwesomeAPI
    const res = await fetch(
      "https://economia.awesomeapi.com.br/last/USD-BRL",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`AwesomeAPI returned ${res.status}`);
    }

    const data = await res.json();
    const rate = parseFloat(data.USDBRL.bid);

    // Cache it
    await supabase.from("exchange_rates").insert({
      currency_pair: "USD-BRL",
      rate,
      source: "awesomeapi",
    });

    console.log(`💱 Exchange rate fetched and cached: USD 1 = BRL ${rate}`);

    return NextResponse.json({
      rate,
      source: "awesomeapi",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Exchange rate fetch failed:", error);
    return NextResponse.json({ rate: 5.5, source: "fallback" });
  }
}
