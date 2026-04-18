import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Gap 3: Payment Webhooks
 * This endpoint receives payment signals to automate credit updates.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-signature"); // Example security header

    // 1. Verify Signature (Security)
    // TODO: Implement specific provider verification (Stripe.webhooks.constructEvent, etc.)
    if (!signature && process.env.NODE_ENV === 'production') {
       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("💰 Payment Webhook received:", body);

    // 2. Identify Event Type
    const eventType = body.type || body.event;
    
    // Example logic for successful payment
    if (eventType === "payment.success" || eventType === "checkout.session.completed") {
      const customerEmail = body.data?.object?.customer_details?.email || body.email;
      const amountPaid = body.data?.object?.amount_total || body.amount;
      
      // Calculate credits (e.g., 10 credits per R$ 20)
      const creditsToAdd = 10; 

      if (customerEmail) {
        const supabase = await createClient();
        
        // Find user by email
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, credits_remaining")
          .eq("email", customerEmail)
          .single();

        if (profile) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ 
               credits_remaining: (profile.credits_remaining || 0) + creditsToAdd 
            })
            .eq("id", profile.id);

          if (updateError) throw updateError;
          console.log(`✅ Added ${creditsToAdd} credits to ${customerEmail}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
