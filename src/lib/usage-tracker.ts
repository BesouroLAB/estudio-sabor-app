import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// We use service role key for backend tracking to bypass RLS if needed, 
// but sticking to anon for now as it's what's available in .env.
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Gemini pricing (USD per 1M tokens)
const PRICING = {
  "gemini-2.5-flash-image": { input: 0.15, output: 0.60, imageOutput: 0.0315 },
  "gemini-1.5-flash": { input: 0.075, output: 0.30 },
} as const;

type ModelKey = keyof typeof PRICING;

interface UsageParams {
  callType: "image_generation" | "copywriting";
  model: string;
  tokensInput: number;
  tokensOutput: number;
  isImageOutput?: boolean;
  imageBase64?: string; // Add this for storage upload
  userId?: string;
  userEmail?: string;
  status?: "success" | "error";
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

function calculateCostUsd(params: UsageParams): number {
  const pricing = PRICING[params.model as ModelKey];
  if (!pricing) return 0;

  if (params.isImageOutput && "imageOutput" in pricing) {
    return pricing.imageOutput;
  }

  const inputCost = (params.tokensInput / 1_000_000) * pricing.input;
  const outputCost = (params.tokensOutput / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Fetches the cached USD→BRL rate, or returns a fallback.
 */
async function getExchangeRate(): Promise<number> {
  if (!supabase) return 5.50;

  const { data } = await supabase
    .from("exchange_rates")
    .select("rate")
    .eq("currency_pair", "USD-BRL")
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  return data?.rate ?? 5.50;
}

/**
 * Gap 4: Circuit Breaker Logic
 * Returns true if we are WITHIN budget, false if we should block the call.
 */
export async function checkCircuitBreaker(): Promise<{ allowed: boolean; reason?: string }> {
  if (!supabase) return { allowed: true };

  try {
    // 1. Get Settings
    const { data: settings } = await supabase
      .from("settings")
      .select("daily_budget_brl, is_safe_mode")
      .eq("id", "global")
      .single();

    if (!settings || !settings.is_safe_mode) return { allowed: true };

    // 2. Calculate Today's Spending
    const today = new Date().toISOString().split("T")[0];
    const { data: usageData } = await supabase
      .from("api_usage")
      .select("cost_brl")
      .gte("created_at", today);

    const spentToday = (usageData || []).reduce((acc, curr) => acc + (Number(curr.cost_brl) || 0), 0);

    if (spentToday >= settings.daily_budget_brl) {
      return { 
        allowed: false, 
        reason: `Daily budget exceeded: R$ ${spentToday.toFixed(2)} / R$ ${settings.daily_budget_brl.toFixed(2)}` 
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error("❌ Circuit breaker check failed, allowing by default:", err);
    return { allowed: true };
  }
}

/**
 * Gap 2: Asset Management (Base64 -> Storage)
 */
async function uploadImageToStorage(base64Data: string, userId?: string): Promise<string | null> {
  if (!supabase) return null;

  try {
    const fileName = `${userId || "anon"}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const buffer = Buffer.from(base64Data, 'base64');

    const { error } = await supabase.storage
      .from('generations')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('generations')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error("❌ Failed to upload image to storage:", err);
    return null;
  }
}

/**
 * Track an API call in the database for admin analytics.
 */
export async function trackUsage(params: UsageParams): Promise<void> {
  if (!supabase) {
    console.warn("⚠️ Supabase not configured — usage not tracked.");
    return;
  }

  try {
    const costUsd = calculateCostUsd(params);
    const exchangeRate = await getExchangeRate();
    const costBrl = costUsd * exchangeRate;

    let storageUrl = null;
    if (params.imageBase64 && params.status !== "error") {
      storageUrl = await uploadImageToStorage(params.imageBase64, params.userId);
    }

    const { error } = await supabase.from("api_usage").insert({
      user_id: params.userId || null,
      user_email: params.userEmail || null,
      call_type: params.callType,
      model: params.model,
      tokens_input: params.tokensInput,
      tokens_output: params.tokensOutput,
      cost_usd: costUsd,
      cost_brl: costBrl,
      status: params.status || "success",
      error_message: params.errorMessage || null,
      metadata: params.metadata || {},
      storage_url: storageUrl,
    });

    if (error) throw error;
    console.log(
      `📊 Tracked: ${params.callType} (${params.model}) — URL: ${storageUrl ? 'Persisted' : 'None'} — R$${costBrl.toFixed(4)}`
    );
  } catch (err) {
    console.error("❌ Failed to track usage:", err);
  }
}
