-- =============================================
-- Estúdio & Sabor 2.0 — Assinaturas (Modelo Híbrido)
-- =============================================

-- 1. Adicionando colunas de controle de assinatura ao Perfil
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due')),
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
  ADD COLUMN IF NOT EXISTS subscription_renews_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mp_preapproval_id TEXT;

-- 2. Índices para buscas rápidas (Dashboard Admin / Trabalhos agendados)
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_mp_preapproval_id ON public.profiles(mp_preapproval_id);

-- 3. Nova RPC: process_subscription_renewal
-- Responsável por renovar a assinatura e adicionar os créditos de forma atômica
CREATE OR REPLACE FUNCTION public.process_subscription_renewal(
  target_user_id UUID,
  plan_name TEXT,
  mp_subscription_id TEXT,
  credits_to_add INTEGER,
  paid_amount NUMERIC
)
RETURNS JSON AS $$
DECLARE
  updated_credits INTEGER;
BEGIN
  -- A. Renova a assinatura por +30 dias e adiciona os créditos
  UPDATE public.profiles
  SET 
    subscription_status = 'active',
    subscription_plan = plan_name,
    mp_preapproval_id = mp_subscription_id,
    subscription_renews_at = now() + INTERVAL '30 days',
    credits_remaining = credits_remaining + credits_to_add,
    updated_at = now()
  WHERE id = target_user_id
  RETURNING credits_remaining INTO updated_credits;

  -- B. Salva no extrato de créditos
  INSERT INTO public.credit_transactions (
    user_id, 
    amount, 
    type, 
    status,
    mp_payment_id, 
    package_name, 
    paid_amount_brl
  ) VALUES (
    target_user_id,
    credits_to_add,
    'purchase',
    'approved',
    'sub_' || mp_subscription_id || '_' || extract(epoch from now()), -- Pseudo ID para a transação
    plan_name,
    paid_amount
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
