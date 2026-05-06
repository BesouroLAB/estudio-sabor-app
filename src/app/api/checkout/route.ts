import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

// Definição dos nossos pacotes (fonte da verdade)
const PACKAGES = {
  assinatura_pro: {
    title: 'Assinatura PRO (60 Créditos/mês)',
    price: 49.90,
    credits: 60,
    package_name: 'Assinatura PRO',
    is_subscription: true
  },
  emergencia: {
    title: 'Kit Essencial (10 Créditos)',
    price: 29.90,
    credits: 10,
    package_name: 'Kit Essencial'
  },
  agencia: {
    title: 'Combo Cardápio Completo (30 Créditos)',
    price: 59.90,
    credits: 30,
    package_name: 'Combo Cardápio Completo'
  },
  imperio: {
    title: 'Kit Dominação Local (100 Créditos)',
    price: 149.90,
    credits: 100,
    package_name: 'Kit Dominação Local'
  }
};

export async function POST(request: Request) {
  try {
    // 1. Verificar se o usuário está logado
    const supabase = await createClient();
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

    const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES] as any;

    // 3. Inicializar Mercado Pago
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      console.error('[Checkout API] Erro: MERCADOPAGO_ACCESS_TOKEN não configurado');
      return NextResponse.json({ error: 'Configuração de pagamento incompleta' }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ 
      accessToken: token 
    });

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    if (selectedPackage.is_subscription) {
      // 4A. Criar Assinatura Recorrente (PreApproval)
      // Note: We use dynamic import or require if PreApproval is not exported at top level, but it is.
      const { PreApproval } = require('mercadopago');
      const preApproval = new PreApproval(client);

      const response = await preApproval.create({
        body: {
          reason: selectedPackage.title,
          external_reference: userId, // Webhook usará isso para saber o usuário
          payer_email: userEmail,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: selectedPackage.price,
            currency_id: 'BRL',
          },
          back_url: `${baseUrl}/estudio?payment=success`,
          status: 'pending'
        }
      });
      
      return NextResponse.json({ checkoutUrl: response.init_point });

    } else {
      // 4B. Criar a Preferência de Pagamento (Checkout Avulso)
      const { Preference } = require('mercadopago');
      const preference = new Preference(client);

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
            success: `${baseUrl}/estudio?payment=success`,
            failure: `${baseUrl}/estudio/loja-de-creditos?payment=failure`,
            pending: `${baseUrl}/estudio?payment=pending`,
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

      return NextResponse.json({ checkoutUrl: response.init_point });
    }

  } catch (error: any) {
    console.error('[Checkout API] FATAL ERROR:', error);
    
    if (error.response) {
      console.error('[Checkout API] MP Status:', error.response.status);
      console.error('[Checkout API] MP Data:', JSON.stringify(error.response.data || error.response, null, 2));
    }

    return NextResponse.json(
      { 
        error: 'Erro na integração com Mercado Pago',
        details: error.message || 'Erro interno desconhecido',
        mp_details: error.response?.data?.message || null
      },
      { status: 500 }
    );
  }
}
