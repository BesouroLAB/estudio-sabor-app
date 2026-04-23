import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Definição dos nossos pacotes (fonte da verdade)
const PACKAGES = {
  emergencia: {
    title: 'Kit Emergência (10 Créditos)',
    price: 29.90,
    credits: 10,
    package_name: 'Kit Emergência'
  },
  agencia: {
    title: 'Kit Agência Digital (30 Créditos)',
    price: 59.90,
    credits: 30,
    package_name: 'Kit Agência Digital'
  },
  imperio: {
    title: 'Kit Império / Pro (100 Créditos)',
    price: 149.90,
    credits: 100,
    package_name: 'Kit Império'
  }
};

export async function POST(request: Request) {
  try {
    // 1. Verificar se o usuário está logado
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    // Para desenvolvimento/teste, se não tiver sessão, a gente pode usar um ID mockado,
    // mas o ideal é bloquear. Vamos deixar bloqueado para garantir a arquitetura real.
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // 2. Extrair o ID do pacote do corpo da requisição
    const { packageId } = await request.json();

    if (!PACKAGES[packageId as keyof typeof PACKAGES]) {
      return NextResponse.json({ error: 'Pacote inválido' }, { status: 400 });
    }

    const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES];

    // 3. Inicializar Mercado Pago
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
    });
    
    const preference = new Preference(client);

    // 4. Criar a Preferência de Pagamento (Checkout)
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const response = await preference.create({
      body: {
        items: [
          {
            id: packageId,
            title: selectedPackage.title,
            quantity: 1,
            unit_price: selectedPackage.price,
            currency_id: 'BRL',
            description: `Compra de créditos para o app Estúdio & Sabor. Sem expiração.`,
          }
        ],
        payer: {
          email: userEmail,
        },
        // URLs de retorno para onde o usuário volta após o pagamento
        back_urls: {
          success: `${baseUrl}/dashboard?payment=success`,
          failure: `${baseUrl}/dashboard/store?payment=failure`,
          pending: `${baseUrl}/dashboard?payment=pending`,
        },
        auto_return: 'approved',
        // O METADATA É O CORAÇÃO DA NOSSA ARQUITETURA
        // É daqui que o nosso Webhook tira os dados para creditar o saldo no Banco de Dados
        metadata: {
          user_id: userId,
          credits: selectedPackage.credits,
          package_name: selectedPackage.package_name
        },
        // Referência externa para conciliação financeira
        external_reference: `PKG-${packageId}-${Date.now()}`
      }
    });

    // 5. Retornar a URL de pagamento (init_point)
    // Usamos o init_point (oficial do Mercado Pago) em vez do sandbox_init_point se quisermos
    // testar a tela real. Mas a chave TEST já força um ambiente de sandbox.
    return NextResponse.json({ checkoutUrl: response.init_point });

  } catch (error) {
    console.error('[Checkout API] Erro ao criar preferência:', error);
    return NextResponse.json(
      { error: 'Falha ao processar requisição com o Mercado Pago' },
      { status: 500 }
    );
  }
}
