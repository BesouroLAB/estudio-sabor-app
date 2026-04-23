-- =============================================
-- Estúdio & Sabor 2.0 — Payments & Credits
-- =============================================

-- 1. Tabela de Transações de Crédito (Auditoria)
CREATE TABLE public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
  mp_payment_id TEXT, -- ID do Mercado Pago (para compras)
  package_name TEXT,
  paid_amount_brl NUMERIC(10, 2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.credit_transactions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. RPC: add_credits (Blindado / Atômico)
-- Esta função é chamada pelo Webhook do Mercado Pago (via service_role)
CREATE OR REPLACE FUNCTION public.add_credits(
  target_user_id UUID,
  credit_amount INTEGER,
  mp_payment_id TEXT DEFAULT NULL,
  purchased_package TEXT DEFAULT 'Avulso',
  paid_amount_brl NUMERIC DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
  updated_credits INTEGER;
BEGIN
  -- 1. Atualiza o saldo no perfil
  UPDATE public.profiles
  SET 
    credits_remaining = credits_remaining + credit_amount,
    updated_at = now()
  WHERE id = target_user_id
  RETURNING credits_remaining INTO updated_credits;

  -- 2. Registra a transação
  INSERT INTO public.credit_transactions (
    user_id, 
    amount, 
    type, 
    mp_payment_id, 
    package_name, 
    paid_amount_brl
  ) VALUES (
    target_user_id,
    credit_amount,
    'purchase',
    mp_payment_id,
    purchased_package,
    paid_amount_brl
  );

  RETURN json_build_object(
    'success', true,
    'new_balance', updated_credits
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update profiles constraints/defaults (Ensure safety)
ALTER TABLE public.profiles ALTER COLUMN credits_remaining SET DEFAULT 1;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';
