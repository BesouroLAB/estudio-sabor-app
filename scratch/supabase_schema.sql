-- ==============================================================================
-- ESTÚDIO & SABOR 2.0 - SCHEMA DO SUPABASE (COMPLETO E FINAL)
-- Arquitetura de Banco de Dados para Micro-SaaS "Zero-Click"
-- ==============================================================================

-- ==============================================================================
-- PARTE 1: TABELAS DO SISTEMA E ADMIN
-- ==============================================================================

-- 1. TABELA DE CONFIGURAÇÕES GLOBAIS (ADMIN)
-- Permite que o Admin altere variáveis essenciais sem fazer deploy (Ex: Cotação do Dólar).
CREATE TABLE public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA DE PRESETS DE ENGENHARIA DE PROMPT (A INTELIGÊNCIA DA IA)
-- Câmera, iluminação e prompts negativos separados por categoria.
CREATE TABLE public.prompt_presets (
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


-- ==============================================================================
-- PARTE 2: TABELAS DO USUÁRIO E SAAS
-- ==============================================================================

-- 2. TABELA DE PERFIS (PROFILES E LTV)
-- Guarda informações do usuário, Saldo de Créditos e Métricas de Recorrência (LTV).
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    credits_balance INTEGER DEFAULT 0 NOT NULL CHECK (credits_balance >= 0),
    total_purchases INTEGER DEFAULT 0 NOT NULL, -- Recorrência
    total_spent_brl NUMERIC(10, 2) DEFAULT 0.00 NOT NULL, -- LTV Financeiro
    last_purchase_date TIMESTAMP WITH TIME ZONE,
    current_tier TEXT DEFAULT 'Free' NOT NULL, -- Ex: "Kit Emergência", "Kit Agência"
    is_suspended BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE TRANSAÇÕES DE CRÉDITO (MERCADO PAGO E AUDITORIA)
-- Livro-caixa inalterável do sistema.
CREATE TYPE transaction_type AS ENUM ('purchase', 'usage', 'admin_adjustment', 'onboarding_bonus');

CREATE TABLE public.credit_transactions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- Valores positivos (compras) ou negativos (uso)
    type transaction_type NOT NULL,
    reference_id TEXT, -- ID do pagamento no Mercado Pago ou ID do log de uso
    package_name TEXT, -- Nome do pacote comprado
    amount_paid_brl NUMERIC(10, 2), -- Valor pago na transação em R$
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE CAMPANHAS / PRATOS (PORTFÓLIO DO LOJISTA)
-- Guarda os ativos gerados para exibir no painel "Meus Pratos".
CREATE TYPE call_type AS ENUM ('kit_completo', 'imagem_unica', 'apenas_copy');

CREATE TABLE public.campaigns (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    dish_name TEXT NOT NULL, -- Ex: "X-Bacon Duplo"
    dish_category TEXT, -- Ex: "Hambúrguer"
    type call_type NOT NULL,
    functional_image_url TEXT, -- Link da imagem iFood limpa
    promotional_image_url TEXT, -- Link da imagem para Redes Sociais
    generated_copy TEXT, -- Textos de neuromarketing (JSON/String)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE TELEMETRIA E "CUPOM FISCAL" (GENERATION LOGS)
-- Auditoria de Custos de IA em tempo real.
CREATE TABLE public.generation_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    type call_type NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost_usd NUMERIC(10, 6) DEFAULT 0, -- Custo na API da Fal.ai e Gemini
    exchange_rate NUMERIC(10, 4) DEFAULT 5.5000, -- Cotação do Dólar no dia
    cost_brl NUMERIC(10, 6) GENERATED ALWAYS AS (cost_usd * exchange_rate) STORED, -- Cupom Fiscal Real
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==============================================================================
-- PARTE 3: FUNÇÕES RPC (STORED PROCEDURES)
-- ==============================================================================

-- Função 1: Consumir Créditos com Segurança Absoluta
CREATE OR REPLACE FUNCTION decrement_credits(target_user_id UUID, credit_cost INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_balance INTEGER;
BEGIN
    -- FOR UPDATE trava a linha e impede Race Conditions (duplo clique)
    SELECT credits_balance INTO current_balance 
    FROM public.profiles 
    WHERE id = target_user_id 
    FOR UPDATE;

    IF current_balance >= credit_cost THEN
        -- Tira o crédito
        UPDATE public.profiles
        SET credits_balance = credits_balance - credit_cost
        WHERE id = target_user_id;
        
        -- Registra a saída no livro-caixa
        INSERT INTO public.credit_transactions (user_id, amount, type, reference_id)
        VALUES (target_user_id, -credit_cost, 'usage', 'system_deduction');
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;

-- Função 2: Adicionar Créditos (Via Webhook do Mercado Pago)
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
    -- Soma o saldo e atualiza o histórico do usuário (LTV)
    UPDATE public.profiles
    SET 
        credits_balance = credits_balance + credit_amount,
        total_purchases = total_purchases + 1,
        total_spent_brl = total_spent_brl + paid_amount_brl,
        last_purchase_date = now(),
        current_tier = purchased_package
    WHERE id = target_user_id;

    -- Registra a entrada de dinheiro no livro-caixa
    INSERT INTO public.credit_transactions (user_id, amount, type, reference_id, package_name, amount_paid_brl)
    VALUES (target_user_id, credit_amount, 'purchase', mp_payment_id, purchased_package, paid_amount_brl);

    RETURN TRUE;
END;
$$;


-- ==============================================================================
-- PARTE 4: INSERÇÃO DE DADOS INICIAIS (SEED)
-- ==============================================================================

-- 1. Inserir Configurações Globais Iniciais
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('usd_brl_rate', '5.50', 'Cotação atual do dólar para cálculo de custos de IA (Cupom Fiscal)'),
    ('maintenance_mode', 'false', 'Se true, bloqueia novas gerações no app')
ON CONFLICT (key) DO NOTHING;

-- 2. Inserir Presets "Matadores" na Tabela de Prompt Engineering (Baseados no nosso Report Híbrido)
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

-- ==============================================================================
-- NOTAS DE SEGURANÇA (RLS - Row Level Security)
-- ==============================================================================
-- Ao subir este script no Supabase, lembre-se de ativar o RLS para todas as tabelas de Usuário:
-- 1. profiles: auth.uid() = id
-- 2. campaigns: auth.uid() = user_id
-- 3. credit_transactions: auth.uid() = user_id
-- As tabelas de sistema (system_settings e prompt_presets) devem ser apenas Leitura Pública ou restritas a service_role.
