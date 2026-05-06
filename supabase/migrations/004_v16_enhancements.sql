-- =============================================
-- Estúdio & Sabor 2.0 — V16 Enhancements
-- =============================================

-- 1. Adicionar colunas faltantes ao Perfil
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS establishment_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cuisine_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS menu_link TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Tabela de Custos de Serviço
CREATE TABLE IF NOT EXISTS public.service_costs (
  id TEXT PRIMARY KEY, -- ex: 'ia_food_preset', 'full_kit_promo'
  label TEXT NOT NULL,
  cost_credits INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir custos padrão
INSERT INTO public.service_costs (id, label, cost_credits, description)
VALUES 
('ia_food_preset', 'Gerador de Foto Profissional', 25, 'Geração de imagem IA com copywriting'),
('full_kit_promo', 'Kit Promocional Completo', 25, 'Kit completo para iFood e redes sociais'),
('resize_compression', 'Redimensionamento iFood', 1, 'Apenas ajuste de formato e peso'),
('whatsapp_banner', 'Banner WhatsApp', 10, 'Formato 9:16 otimizado'),
('instagram_stories', 'Insta Stories', 10, 'Formato Stories com mockup')
ON CONFLICT (id) DO UPDATE 
SET cost_credits = EXCLUDED.cost_credits, label = EXCLUDED.label;

-- 3. Atualizar gatilho de novo usuário para conceder 30 créditos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    account_type, 
    credits_remaining
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    'free',
    30 -- 30 Créditos Iniciais (Onboarding Bonus)
  );

  -- Registrar transação de bônus
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    type,
    package_name
  ) VALUES (
    NEW.id,
    30,
    'bonus',
    'Onboarding Bonus'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: consume_credits (Blindado)
CREATE OR REPLACE FUNCTION public.consume_credits(
  p_user_id UUID,
  p_service_id TEXT,
  p_reference_id TEXT
)
RETURNS JSON AS $$
DECLARE
  v_cost INTEGER;
  v_balance INTEGER;
BEGIN
  -- 1. Obter custo do serviço
  SELECT cost_credits INTO v_cost FROM public.service_costs WHERE id = p_service_id;
  
  IF v_cost IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Serviço não encontrado');
  END IF;

  -- 2. Verificar se a transação já foi processada (Idempotência)
  IF EXISTS (SELECT 1 FROM public.credit_transactions WHERE reference_id = p_reference_id) THEN
    SELECT credits_remaining INTO v_balance FROM public.profiles WHERE id = p_user_id;
    RETURN json_build_object('success', true, 'remaining_credits', v_balance, 'note', 'Transação já processada');
  END IF;

  -- 3. Verificar saldo
  SELECT credits_remaining INTO v_balance FROM public.profiles WHERE id = p_user_id;
  
  IF v_balance < v_cost THEN
    RETURN json_build_object('success', false, 'error', 'Saldo insuficiente. Você tem ' || v_balance || ' créditos, mas precisa de ' || v_cost);
  END IF;

  -- 4. Deduzir créditos
  UPDATE public.profiles 
  SET credits_remaining = credits_remaining - v_cost,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING credits_remaining INTO v_balance;

  -- 5. Registrar transação
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    type,
    package_name,
    metadata,
    reference_id
  ) VALUES (
    p_user_id,
    -v_cost,
    'usage',
    p_service_id,
    jsonb_build_object('service_id', p_service_id),
    p_reference_id
  );

  RETURN json_build_object(
    'success', true, 
    'remaining_credits', v_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Adicionar reference_id à tabela se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='credit_transactions' AND column_name='reference_id') THEN
    ALTER TABLE public.credit_transactions ADD COLUMN reference_id TEXT;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_transactions_reference_id ON public.credit_transactions(reference_id);
  END IF;
END $$;
