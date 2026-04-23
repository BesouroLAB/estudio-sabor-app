import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";


interface CheckoutRequest {
  userId: string;
  packageId: string;
}

const PACKAGE_PRICES: Record<string, number> = {
  kit_emergencia: 29.90,
  kit_agencia: 59.90,
  kit_imperio: 149.90,
};

const PACKAGE_NAMES: Record<string, string> = {
  kit_emergencia: "Estúdio Sabor - Kit Emergência (10 Créditos)",
  kit_agencia: "Estúdio Sabor - Agência Digital (30 Créditos)",
  kit_imperio: "Estúdio Sabor - Kit Império Pro (100 Créditos)",
};

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequest = await req.json();
    const { userId, packageId } = body;

    if (!userId || !packageId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const PACKAGE_CREDITS: Record<string, number> = {
      kit_emergencia: 10,
      kit_agencia: 30,
      kit_imperio: 100,
    };

    const price = PACKAGE_PRICES[packageId];
    const description = PACKAGE_NAMES[packageId];
    const credits = PACKAGE_CREDITS[packageId];

    if (!price || !credits) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("MERCADOPAGO_ACCESS_TOKEN not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
    const payment = new Payment(client);

    const idempotencyKey = crypto.randomUUID();

    // Criação de pagamento PIX Direto
    const response = await payment.create({
      body: {
        transaction_amount: price,
        description: description,
        payment_method_id: "pix",
        payer: {
          email: "comprador@estudiosabor.com.br", 
        },
        external_reference: userId, // Simplificado apenas para o ID do usuário
        metadata: {
          user_id: userId,
          credits: credits,
          package_name: packageId
        }
      },
      requestOptions: {
        idempotencyKey,
      }
    });

    return NextResponse.json({
      qr_code: response.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
      payment_id: response.id,
    });
  } catch (error) {
    console.error("Checkout PIX Error:", error);
    return NextResponse.json(
      { error: "Failed to generate pix payment" },
      { status: 500 }
    );
  }
}
