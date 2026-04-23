-- 1. Limpeza de Categorias Duplicadas/Agrupadas na tabela prompt_templates
-- Removemos as categorias que estão agrupadas (Ex: "Comida Brasileira, Massas")
-- E mantemos apenas as individuais.

DELETE FROM prompt_templates 
WHERE category LIKE '%,%';

-- 2. Configurações do Sistema (System Settings)
-- Adicionando ou atualizando o número do WhatsApp e outras configurações vitais.

INSERT INTO system_settings (key, value, description)
VALUES 
('whatsapp_number', '+55 16 98803-1505', 'Número oficial de suporte via WhatsApp'),
('support_email', 'suporte@estudiosabor.com.br', 'Email oficial de suporte'),
('maintenance_mode', false, 'Ativa/desativa o modo de manutenção global'),
('platform_discount_active', false, 'Ativa um banner de desconto em toda a plataforma'),
('platform_discount_value', 15, 'Valor do desconto em porcentagem (%)')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, description = EXCLUDED.description;

-- 3. Nota sobre Timestamps
-- Os timestamps no banco permanecerão em UTC (padrão SQL).
-- A formatação para pt-BR já foi implementada no Front-end (Admin e Dashboard).
