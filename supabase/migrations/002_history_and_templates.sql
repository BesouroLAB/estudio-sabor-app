-- =============================================
-- Estúdio & Sabor 2.0 — History & Storage
-- =============================================

-- 1. Criação do Bucket de Storage "creations"
-- Nota: Isso precisa de extensões e permissões do storage. As inserções serão feitas no servidor via role service_key, mas os clientes precisarão ler.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('creations', 'creations', true)
ON CONFLICT (id) DO NOTHING;

-- Policies de RLS para o bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'creations');

CREATE POLICY "Authenticated users can upload creations" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'creations');

-- 2. Tabela Creations para a Galeria do Lojista
CREATE TABLE public.creations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  prompt_metadata JSONB DEFAULT '{}', -- Qual comida, qual estilo
  copywriting_texts JSONB DEFAULT '[]', -- As três copies retornadas
  is_bookmarked BOOLEAN DEFAULT false,
  format_selected TEXT DEFAULT '1:1',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices de performance
CREATE INDEX idx_creations_user_id ON public.creations(user_id);
CREATE INDEX idx_creations_created_at ON public.creations(created_at DESC);

-- RLS Segurança
ALTER TABLE public.creations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own creations"
  ON public.creations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creations"
  ON public.creations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creations"
  ON public.creations FOR UPDATE
  USING (auth.uid() = user_id);
