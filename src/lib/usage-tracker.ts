import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// We use service role key for backend tracking to bypass RLS
const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Gemini pricing (USD per 1M tokens) - Update as needed for 2025/2026 pricing
const PRICING = {
  "gemini-2.5-flash-image": { input: 0.15, output: 0.60, imageOutput: 0.0315 },
  "gemini-1.5-flash": { input: 0.075, output: 0.30 },
  "unified-kit-v1": { input: 0.10, output: 0.40 }, // Weighted average
} as const;

type ModelKey = keyof typeof PRICING;

interface UsageParams {
  callType: "full_kit" | "image_generation" | "copywriting";
  model: string;
  tokensInput?: number;
  tokensOutput?: number;
  isImageOutput?: boolean;
  imageBase64?: string;
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

  const input = params.tokensInput || 0;
  const output = params.tokensOutput || 0;

  const inputCost = (input / 1_000_000) * pricing.input;
  const outputCost = (output / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Fetches the USD→BRL rate from system_settings or updates it via AwesomeAPI if stale.
 */
async function getExchangeRate(): Promise<number> {
  if (!supabase) return 5.50;

  try {
    // Check current setting
    const { data: setting } = await supabase
      .from("system_settings")
      .select("value, updated_at")
      .eq("key", "usd_brl_rate")
      .single();

    const now = new Date();
    const lastUpdate = setting?.updated_at ? new Date(setting.updated_at) : new Date(0);
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    // If older than 24h, use the sync service
    if (!setting || hoursSinceUpdate > 24) {
      const { syncExchangeRate } = await import("@/lib/services/exchange-rate");
      return await syncExchangeRate();
    }

    return parseFloat(setting?.value || "5.50");
  } catch (err) {
    console.error("❌ Failed to fetch/update exchange rate in tracker:", err);
    return 5.50;
  }
}

/**
 * Gap 4: Circuit Breaker Logic
 */
export async function checkCircuitBreaker(): Promise<{ allowed: boolean; reason?: string }> {
  if (!supabase) return { allowed: true };

  try {
    const { data: settings } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "global_budget")
      .single();

    const budget = settings?.value as any;
    if (!budget || !budget.is_safe_mode) return { allowed: true };

    const today = new Date().toISOString().split("T")[0];
    const { data: usageData } = await supabase
      .from("api_usage")
      .select("cost_brl")
      .gte("created_at", today);

    const spentToday = (usageData || []).reduce((acc, curr) => acc + (Number(curr.cost_brl) || 0), 0);

    if (spentToday >= budget.daily_budget_brl) {
      return { 
        allowed: false, 
        reason: `Daily budget exceeded: R$ ${spentToday.toFixed(2)} / R$ ${budget.daily_budget_brl.toFixed(2)}` 
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error("❌ Circuit breaker check failed:", err);
    return { allowed: true };
  }
}

/**
 * Track an API call in the database for admin analytics.
 */
export async function trackUsage(params: UsageParams): Promise<void> {
  if (!supabase) return;

  try {
    const costUsd = calculateCostUsd(params);
    const exchangeRate = await getExchangeRate();
    const costBrl = costUsd * exchangeRate;

    const { error } = await supabase.from("api_usage").insert({
      user_id: params.userId || null,
      call_type: params.callType,
      model: params.model,
      input_tokens: params.tokensInput || 0,
      output_tokens: params.tokensOutput || 0,
      cost_usd: costUsd,
      exchange_rate: exchangeRate,
      cost_brl: costBrl,
      status: params.status || "success",
      error_message: params.errorMessage || null,
      metadata: params.metadata || {},
    });

    if (error) throw error;
    console.log(
      `📊 [${params.callType}] Logged to api_usage — Cost: R$${costBrl.toFixed(4)}`
    );
  } catch (err) {
    console.error("❌ Failed to track usage:", err);
  }
}
