import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getAdminSupabase } from "@/lib/admin"; // Note we need this utility

const PACKAGE_CREDITS: Record<string, number> = {
  kit_emergencia: 10,
  kit_agencia: 30,
  kit_imperio: 100,
};

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");

    if (type !== "payment" || !id) {
      return NextResponse.json({ received: true }); // Ignore non-payment hooks
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    if (!accessToken) {
      console.error("MERCADOPAGO_ACCESS_TOKEN not set");
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }

    // Validação de assinatura se necessário. O MP envia o x-signature no header.
    // Como simplificação para o MBP, vamos buscar diretamente pelo ID recebido usando nossa própria chave privada:
    
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    
    // Busca na fonte da verdade (Mercado Pago API) o status real para evitar fraude/spoofing do hook
    const paymentData = await payment.get({ id });

    if (paymentData.status === "approved") {
      const extRef = paymentData.external_reference;
      if (extRef) {
        const [userId, packageId] = extRef.split("|");
        
        const creditsToAdd = PACKAGE_CREDITS[packageId];
        
        if (userId && creditsToAdd) {
          // Usa conexão admin pois a RLS do profile.credits pode barrar edição do lado do servidor não autenticado
          const supabaseAdmin = getAdminSupabase();
          
          // Note: Ideally use a PostgreSQL RPC for atomic increment,
          // but fetching and updating works for MVP or we enforce a custom trigger.
          // Since we want to increment atomically:
          const { data: profile, error: readError } = await  supabaseAdmin
            .from("profiles")
            .select("credits")
            .eq("id", userId)
            .single();
            
          if (!readError && profile) {
            const newCredits = (profile.credits || 0) + creditsToAdd;
            const { error: updateError } = await supabaseAdmin
              .from("profiles")
              .update({ credits: newCredits })
              .eq("id", userId);
              
            if (updateError) {
              console.error("Failed to update user credits:", updateError);
            } else {
              console.log(`Successfully credited ${creditsToAdd} to user ${userId}`);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
