# 🌶️ Estúdio & Sabor 2.0 - Hub de Marketing IA para Delivery

O **Estúdio & Sabor 2.0** é uma plataforma SaaS (Software as a Service) desenvolvida para transformar a presença digital de restaurantes e deliveries. Utilizando a potência da inteligência artificial do Google Gemini, o app permite que donos de restaurantes transformem fotos simples de celular em pacotes de marketing profissionais em segundos.

## 🚀 Funcionalidades Principais

- **✨ Exportação Mágica (Image Enhancement)**: Processamento de fotos brutas para o padrão estético do iFood e redes sociais.
- **✍️ Neuro-Copywriter**: Geração de descrições persuasivas, descritivas e de urgência para aumentar a taxa de conversão do cardápio.
- **📐 Formatos Inteligentes**: Geração automática de formatos (1:1 Cardápio, 4:1 Capa iFood, 9:16 Stories).
- **📊 Registro de Uso**: Monitoramento de custos e tokens integrado ao Supabase.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, Framer Motion.
- **Backend**: Next.js API Routes.
- **IA**: Google Gemini 1.5 Flash & Gemini 2.5 Flash Image.
- **Banco de Dados/Logs**: Supabase.
- **Ícones**: Lucide React.

## 📦 Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/BesouroLAB/estudio-sabor-app.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   GEMINI_FALLBACK_KEY=sua_chave_fallback_aqui
   NEXT_PUBLIC_SUPABASE_URL=seu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_anonima_supabase
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` ou a porta indicada.

## ⚖️ Licença

Este projeto está sob a licença [MIT](LICENSE).

---
Desenvolvido com ❤️ por **BesouroLAB**
