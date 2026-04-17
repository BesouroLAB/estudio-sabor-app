import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Initialize Supabase only if keys are available
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Logs AI usage to Supabase for cost tracking and analytics.
 * Ported from legacy Estudio & Sabor
 */
export async function logUsage(params: {
  operation_type: 'image_generation' | 'image_enhancement' | 'copywriting',
  model_used: string,
  input_tokens: number,
  output_tokens: number,
  isImage: boolean
}) {
  if (!supabase) {
    console.warn("⚠️ Supabase not configured for usage logging.");
    return;
  }

  try {
    let cost = 0;
    if (params.isImage) {
      // Imagen 3 / Gemini Image pricing: approx $0.03 per image
      cost = 0.03 * 5.5; // BRL conversion approx
    } else {
      // Gemini 1.5 Flash pricing: $0.075 / 1M input, $0.30 / 1M output
      const inputCostBRL = (params.input_tokens / 1000000) * 0.075 * 5.5;
      const outputCostBRL = (params.output_tokens / 1000000) * 0.30 * 5.5;
      cost = inputCostBRL + outputCostBRL;
    }

    // Since we don't have user authentication yet in this demo phase, 
    // we log with a 'demo_user' or leave user_id null
    const { error } = await supabase.from('usage_logs').insert([{
      operation_type: params.operation_type,
      model_used: params.model_used,
      input_tokens: params.input_tokens,
      output_tokens: params.output_tokens,
      cost_estimated_brl: cost,
      created_at: new Error().stack // Simple way to track timestamp if DB doesn't default it
    }]);

    if (error) throw error;
    console.log(`📊 Usage logged: ${params.operation_type} (${params.model_used}) - Cost: R$ ${cost.toFixed(4)}`);
  } catch (err) {
    console.error("❌ Failed to log usage:", err);
  }
}
