-- =============================================
-- Estúdio & Sabor 2.0 — Migration 006
-- Granular Workflow Enums & Payments Status
-- =============================================

-- 1. Add status column to credit_transactions
ALTER TABLE public.credit_transactions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded', 'failed'));

-- 2. Update call_type ENUM to support new granular workflows
-- In PostgreSQL, we can add values to an existing ENUM
ALTER TYPE call_type ADD VALUE IF NOT EXISTS 'aprimorar_imagem';
ALTER TYPE call_type ADD VALUE IF NOT EXISTS 'post_rede_social';
ALTER TYPE call_type ADD VALUE IF NOT EXISTS 'stories_rede_social';

-- 3. Update service_costs table to reflect the new pricing strategy
-- We'll insert the new services and update existing ones if they match
INSERT INTO public.service_costs (id, label, cost_credits, description)
VALUES 
('aprimorar_imagem', 'Aprimorar Prato', 1, '1 Imagem (Upgrade visual)'),
('post_rede_social', 'Criar Post (Feed)', 2, '1 Imagem (1:1) + Copy (Texto)'),
('stories_rede_social', 'Criar Stories', 2, '1 Imagem (9:16) + Copy curta'),
('kit_completo', 'Kit Completo', 5, '3-4 Imagens + Múltiplas Cópias')
ON CONFLICT (id) DO UPDATE 
SET cost_credits = EXCLUDED.cost_credits, 
    label = EXCLUDED.label,
    description = EXCLUDED.description;

-- Note: existing old service_costs can remain or be deleted later if unused.
