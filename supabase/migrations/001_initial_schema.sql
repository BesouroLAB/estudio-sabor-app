-- =============================================
-- Estúdio & Sabor 2.0 — Initial Schema
-- =============================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  account_type TEXT DEFAULT 'free' CHECK (account_type IN ('free', 'starter', 'pro', 'enterprise')),
  credits_remaining INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, account_type, credits_remaining)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    'free',
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. API USAGE TRACKING
CREATE TABLE public.api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  call_type TEXT NOT NULL CHECK (call_type IN ('image_generation', 'copywriting')),
  model TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  cost_usd NUMERIC(10, 6) DEFAULT 0,
  cost_brl NUMERIC(10, 4) DEFAULT 0,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON public.api_usage(created_at DESC);
CREATE INDEX idx_api_usage_call_type ON public.api_usage(call_type);

-- 3. EXCHANGE RATES CACHE
CREATE TABLE public.exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_pair TEXT NOT NULL DEFAULT 'USD-BRL',
  rate NUMERIC(10, 4) NOT NULL,
  source TEXT DEFAULT 'awesomeapi',
  fetched_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_exchange_rates_fetched_at ON public.exchange_rates(fetched_at DESC);

-- 4. ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- API Usage policies
CREATE POLICY "Users can view own usage"
  ON public.api_usage FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all usage"
  ON public.api_usage FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated can insert usage"
  ON public.api_usage FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can insert usage"
  ON public.api_usage FOR INSERT
  TO anon
  WITH CHECK (true);

-- Exchange rates policies (public read, server insert)
CREATE POLICY "Anyone can read exchange rates"
  ON public.exchange_rates FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert exchange rates"
  ON public.exchange_rates FOR INSERT
  WITH CHECK (true);
