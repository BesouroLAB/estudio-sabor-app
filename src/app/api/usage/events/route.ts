import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { usageId, eventType } = await req.json();

    if (!usageId || !eventType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Gap 1: Telemetry of success
    // If download, update downloaded_at
    if (eventType === "download") {
      const { error } = await supabase
        .from("api_usage")
        .update({ downloaded_at: new Date().toISOString() })
        .eq("id", usageId);
      
      if (error) throw error;
    }

    // You can extend this for "thumbs_up", "shared", etc.
    const { error: metaError } = await supabase.rpc('append_usage_metadata', {
      usage_id: usageId,
      new_data: { [eventType]: true, [`${eventType}_at`]: new Date().toISOString() }
    });
    
    // If the RPC doesn't exist yet, we can do it via normal update
    if (metaError) {
      // Fallback update
      await supabase.from("api_usage").update({
        metadata: { 
          event: eventType, 
          event_at: new Date().toISOString() 
        }
      }).eq("id", usageId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Telemetry failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
