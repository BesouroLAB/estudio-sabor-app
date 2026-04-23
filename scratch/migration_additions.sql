-- ==============================================================================
-- SCRIPT DE MIGRAÇÃO (APENAS ADIÇÕES E ATUALIZAÇÕES)
-- Rode este script no SQL Editor do Supabase se você já havia criado as tabelas anteriores.
-- ==============================================================================

-- 1. CRIAR TABELA: Configurações Globais (system_settings)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CRIAR TABELA: Presets de Prompt (prompt_presets)
CREATE TABLE IF NOT EXISTS public.prompt_presets (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    food_category TEXT UNIQUE NOT NULL,
    camera_hardware TEXT NOT NULL,
    lighting_setup TEXT NOT NULL,
    style_override TEXT,
    negative_prompt TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ATUALIZAR TABELA: profiles
-- Adicionando as colunas de controle de plano e data da última compra
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_purchase_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS current_tier TEXT DEFAULT 'Free' NOT NULL;

-- 4. ATUALIZAR TABELA: credit_transactions
-- Adicionando a coluna de rastreio para o Mercado Pago e logs internos
ALTER TABLE public.credit_transactions 
ADD COLUMN IF NOT EXISTS reference_id TEXT;

-- ==============================================================================
-- ATUALIZAR FUNÇÕES RPC (STORED PROCEDURES)
-- ==============================================================================

-- Substitui a função antiga pela nova (com reference_id)
CREATE OR REPLACE FUNCTION decrement_credits(target_user_id UUID, credit_cost INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_balance INTEGER;
BEGIN
    SELECT credits_balance INTO current_balance 
    FROM public.profiles 
    WHERE id = target_user_id 
    FOR UPDATE;

    IF current_balance >= credit_cost THEN
        UPDATE public.profiles
        SET credits_balance = credits_balance - credit_cost
        WHERE id = target_user_id;
        
        INSERT INTO public.credit_transactions (user_id, amount, type, reference_id)
        VALUES (target_user_id, -credit_cost, 'usage', 'system_deduction');
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;

-- Substitui a função antiga pela nova (atualizando current_tier e reference_id)
CREATE OR REPLACE FUNCTION add_credits(
    target_user_id UUID, 
    credit_amount INTEGER, 
    mp_payment_id TEXT, 
    purchased_package TEXT,
    paid_amount_brl NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET 
        credits_balance = credits_balance + credit_amount,
        total_purchases = total_purchases + 1,
        total_spent_brl = total_spent_brl + paid_amount_brl,
        last_purchase_date = now(),
        current_tier = purchased_package
    WHERE id = target_user_id;

    INSERT INTO public.credit_transactions (user_id, amount, type, reference_id, package_name, amount_paid_brl)
    VALUES (target_user_id, credit_amount, 'purchase', mp_payment_id, purchased_package, paid_amount_brl);

    RETURN TRUE;
END;
$$;

-- ==============================================================================
-- INSERIR OS DADOS INICIAIS (SEED)
-- ==============================================================================

-- Configuração Global
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('usd_brl_rate', '5.50', 'Cotação atual do dólar para cálculo de custos de IA (Cupom Fiscal)'),
    ('maintenance_mode', 'false', 'Se true, bloqueia novas gerações no app')
ON CONFLICT (key) DO NOTHING;

-- Presets das Câmeras (As 6 Categorias)
INSERT INTO public.prompt_presets (food_category, camera_hardware, lighting_setup, style_override, negative_prompt)
VALUES 
(
    'Hambúrgueres, Lanches e Pizzas', 
    'Shot on Sony A7 IV, 50mm f/1.4', 
    'Side lighting, dramatic shadows, warm cinematic rim light', 
    'Food photography, highly detailed, sharp focus on melted cheese, juicy meat texture and crispy crust', 
    'plastic food, cartoon, text, watermark, blurry, ugly, extra fingers, messy, unappetizing, burned'
),
(
    'Comida Japonesa e Fine Dining', 
    'Shot on Leica Q2, 28mm f/1.7 Summilux', 
    'Clean, minimalist studio lighting, soft diffused overhead light', 
    'Aesthetic minimalist presentation, premium glossy raw fish, deep rich nori greens, elegant contrast', 
    'plastic food, messy plate, warm yellow tint, cartoon, text, blurry, cheap presentation'
),
(
    'Carnes, Churrasco e Padaria', 
    'Shot on Nikon D850, 85mm f/1.8 macro lens', 
    'Directional hard light, glistening highlights on meat fat, dark moody background', 
    'Food photography, highly detailed, sharp focus on grill marks, smoke, dense rich textures', 
    'plastic food, dry meat, raw blood, cartoon, text, watermark, blurry, ugly, extra fingers'
),
(
    'Saladas e Pratos Leves', 
    'Shot on Canon EOS R5, 35mm f/1.8', 
    'Bright airy lighting, natural morning sunlight, soft translucent shadows', 
    'Food photography, highly detailed, crisp water drops, vibrant greens, sharp focus on fresh ingredients', 
    'plastic food, dark shadows, moody lighting, wilting leaves, cartoon, text, blurry, messy'
),
(
    'Sobremesas, Cafeteria e Doces', 
    'Shot on Fujifilm X-T4, 56mm f/1.2 (Classic Chrome film simulation)', 
    'Soft window lighting, pastel tones, cozy and nostalgic atmosphere', 
    'Food photography, highly detailed, glossy syrups, powdered sugar textures, dreamy aesthetic', 
    'plastic food, harsh shadows, cartoon, text, watermark, blurry, ugly, artificial colors'
),
(
    'Comida Brasileira, Massas e Drinks', 
    'Shot on Canon EOS R6 Mark II, 50mm f/1.2L', 
    'Warm inviting lighting, golden hour simulation, cozy restaurant ambiance', 
    'Food photography, highly detailed, steam rising from hot food, vibrant tomato reds, rich sauces', 
    'plastic food, cold lighting, cartoon, text, watermark, blurry, ugly, mixed unappetizing food'
)
ON CONFLICT (food_category) DO NOTHING;
