import { getAdminSupabase } from "@/lib/admin";

/**
 * Fetches the current USD/BRL exchange rate from Awesome API
 * and updates the system_settings table.
 */
export async function syncExchangeRate() {
  try {
    console.log("🕒 Starting USD/BRL exchange rate sync...");
    
    const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL", {
      next: { revalidate: 0 } // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`Awesome API returned ${response.status}`);
    }

    const data = await response.json();
    const rate = parseFloat(data.USDBRL.bid);

    if (isNaN(rate)) {
      throw new Error("Invalid rate received from API");
    }

    console.log(`💵 Current USD/BRL Rate: R$ ${rate}`);

    const supabase = getAdminSupabase();
    
    const { error } = await supabase
      .from("system_settings")
      .upsert({ 
        key: "usd_brl_rate", 
        value: rate.toString(),
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });

    if (error) {
      throw error;
    }

    return rate;
  } catch (error) {
    console.error("❌ Failed to sync exchange rate:", error);
    throw error;
  }
}
