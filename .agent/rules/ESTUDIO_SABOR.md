# 🌶️ Estúdio & Sabor — Project Knowledge (2026)

Contexto unificado de negócio, banco de dados e arquitetura para o projeto Estúdio & Sabor 2.0.

## 🎯 Produto & Marketing
- **O que é**: "Canivete Suíço" de IA para lojistas de delivery (iFood/Whatsapp).
- **Diferencial**: IA "Food-First" que entende iluminação e estética de pratos.
- **Público**: Donos de restaurantes PME que buscam profissionalismo visual rápido.
- **Voz**: Especialista, ágil, prestativo e focado em resultados (fome visual).

## 🗄️ Database & Infra (Supabase)
- **ID do Projeto**: `vgrfjwwbqflfjfvfsbjd`
- **Tabelas Críticas**:
    - `profiles`: Créditos e permissões (`admin`/`user`).
    - `creations`: Histórico de imagens e copies gerados.
    - `credit_transactions`: Ledger de transações financeiras e uso.
    - `api_usage`: Logs de custo real da IA.
    - `prompt_presets`: 20+ categorias de comida com configurações de câmera e luz.
- **Segurança**: RLS estrito em todas as tabelas. Bypass apenas via `service_role` em API Routes.

## 🏗️ Padrões de Código
- **Next.js 16**: App Router, Server Actions, Middleware para sessão.
- **Tailwind v4**: CSS-first configuration via `@theme` no `globals.css`.
- **SPA Dashboard**: Navegação via `AppStep` no `DashboardContext`.
- **Atômico**: Débito de créditos deve ser a primeira operação na geração de kits.

## 🔗 Chaves e Integrações
- **Mercado Pago**: Checkout de créditos e Webhooks de confirmação.
- **Gemini**: Image Generation e Neuro-Copywriting.
- **Supabase**: Auth, PostgreSQL e Storage (`creations` bucket).
