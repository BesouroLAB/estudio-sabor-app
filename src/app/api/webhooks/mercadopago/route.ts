import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

// Instanciamos o Supabase com a SERVICE_ROLE_KEY (Bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");

    // Ignora eventos que não sejam pagamento ou não tenham ID
    if (type !== "payment" || !id) {
      return NextResponse.json({ received: true }); 
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("[Webhook] MERCADOPAGO_ACCESS_TOKEN não configurado");
      return NextResponse.json({ error: "Configuração do MP ausente" }, { status: 500 });
    }

    // Configura o SDK do Mercado Pago
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    
    // Busca na API do Mercado Pago o status real (Segurança contra Spoofing)
    const paymentData = await payment.get({ id });

    if (paymentData.status === "approved") {
      // Resgate Flexível: Tenta pegar o ID do usuário pelo metadata ou external_reference (Padrão de Assinaturas)
      const metadata = paymentData.metadata || {};
      const userId = metadata.user_id || paymentData.external_reference; 
      
      const isSubscription = metadata.is_subscription === "true" || paymentData.description?.toLowerCase().includes("assinatura");
      const creditsToAssign = parseInt(metadata.credits || (isSubscription ? "60" : "0"), 10);
      const packageName = metadata.package_name || (isSubscription ? "Assinatura PRO" : "Pacote Avulso");
      const amountPaidBrl = paymentData.transaction_amount || 0;

      if (!userId || creditsToAssign <= 0) {
         console.error("[Webhook] Falta ID de usuário ou créditos no pagamento aprovado:", paymentData.id);
         return NextResponse.json({ error: "Dados insuficientes para creditar" }, { status: 400 });
      }

      let dbResult;

      if (isSubscription) {
        // Fluxo 1: Assinatura (Renovação ou Nova)
        // Usa a nova RPC que atualiza a data de vencimento
        dbResult = await supabaseAdmin.rpc('process_subscription_renewal', {
          target_user_id: userId,
          plan_name: packageName,
          mp_subscription_id: String(paymentData.order?.id || paymentData.id), // Idealmente o preapproval_id
          credits_to_add: creditsToAssign,
          paid_amount: amountPaidBrl
        });
      } else {
        // Fluxo 2: Pacote Avulso Clássico
        dbResult = await supabaseAdmin.rpc('add_credits', {
          target_user_id: userId,
          credit_amount: creditsToAssign,
          mp_payment_id: String(id),
          purchased_package: packageName,
          paid_amount_brl: amountPaidBrl
        });
      }

      if (dbResult.error) {
        console.error("[Webhook] Erro Fatal no Supabase RPC:", dbResult.error);
        return NextResponse.json({ error: "Falha ao atualizar o banco de dados" }, { status: 500 });
      }

      console.log(`[Webhook] SUCESSO: ${creditsToAssign} créditos p/ usuário ${userId}. Modelo: ${isSubscription ? 'Assinatura' : 'Avulso'}`);
      return NextResponse.json({ success: true, message: "Créditos liberados com sucesso!" });
    }

    console.log(`[Webhook] Pagamento ${id} ignorado. Status: ${paymentData.status}`);
    return NextResponse.json({ success: true, message: "Status ignorado" });

  } catch (error) {
    console.error("[Webhook] Catch Error:", error);
    return NextResponse.json(
      { error: "Erro interno no processamento do webhook" },
      { status: 500 }
    );
  }
}
