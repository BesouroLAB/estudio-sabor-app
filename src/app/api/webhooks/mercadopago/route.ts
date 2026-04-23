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
      // Usaremos o metadata do MP para pegar os dados do pacote e do usuário.
      // É mais seguro e flexível que o external_reference.
      const metadata = paymentData.metadata || {};
      const userId = metadata.user_id;
      const creditsToAssign = parseInt(metadata.credits || "0", 10);
      const packageName = metadata.package_name || "Pacote Avulso";
      const amountPaidBrl = paymentData.transaction_amount || 0;

      if (!userId || creditsToAssign <= 0) {
         console.error("[Webhook] Falta metadata no pagamento aprovado:", metadata);
         return NextResponse.json({ error: "Metadata inválido" }, { status: 400 });
      }

      // Chama a função RPC blindada do nosso banco de dados
      // Ela atualiza o saldo de créditos (atomizado), atualiza o LTV e salva no credit_transactions
      const { data, error } = await supabaseAdmin.rpc('add_credits', {
        target_user_id: userId,
        credit_amount: creditsToAssign,
        mp_payment_id: String(id),
        purchased_package: packageName,
        paid_amount_brl: amountPaidBrl
      });

      if (error) {
        console.error("[Webhook] Erro Fatal no Supabase RPC add_credits:", error);
        return NextResponse.json({ error: "Falha ao atualizar o banco de dados" }, { status: 500 });
      }

      console.log(`[Webhook] SUCESSO: ${creditsToAssign} créditos p/ usuário ${userId}. Pacote: ${packageName}`);
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
