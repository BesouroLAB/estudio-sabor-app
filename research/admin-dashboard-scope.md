# Painel Administrativo (Admin Area) - Estúdio & Sabor 2.0

## 1. Visão Geral
O painel administrativo será o "centro de comando" financeiro e operacional do SaaS. O objetivo é dar total visibilidade sobre os custos de infraestrutura e o comportamento do lojista (CRM), garantindo que a margem de lucro projetada se mantenha segura.

---

## 2. Métricas Globais (Cards de Alta Visão)
Ao abrir o painel, o administrador terá acesso imediato aos KPIs (Key Performance Indicators) essenciais, filtráveis por período (Hoje, Últimos 7 dias, Este Mês) via Dropdown:

- **Usuários Cadastrados:** Total da base de dados.
- **Meta de Usuários:** Barra de progresso visual para o próximo milestone.
- **Usuários Ativos no Momento:** (Possível através do sistema de *Presence* e *Sessions* do Supabase).
- **Faturamento Mensal Bruto:** Total de transações via Mercado Pago no período.
- **Lucro Líquido Estimado:** Faturamento Bruto menos os custos aferidos pela telemetria do "Cupom Fiscal".

---

## 2. Telemetria de Inteligência Artificial (Custos e "Cupom Fiscal")
Para monitorar a saúde financeira de cada requisição, teremos uma tabela de logs que registrará cada evento no momento em que a imagem/copy for gerada.

**Dados a serem rastreados por Geração:**
- **Usuário:** Identificador de quem fez a chamada.
- **Tipo de Chamada:** (Ex: Kit Completo, Imagem Única, Copywriting).
- **Consumo Gemini:**
  - Tokens de Entrada (Input).
  - Tokens de Saída (Output).
- **Consumo Fal.ai:** Custo em dólares da inferência da imagem.
- **"Cupom Fiscal" em Reais (BRL):** 
  - Vamos integrar uma API de câmbio atualizada a cada 24 horas para pegar o valor do dólar.
  - O sistema pegará o custo em USD retornado pelas APIs (Gemini + Fal) e multiplicará pela cotação do dia.
  - *Visão do Admin:* Você verá exatamente quanto custou em Reais (R$) aquela requisição específica contra o valor que o usuário pagou naquele crédito, revelando o **Lucro Líquido por clique**.

---

## 4. CRM e Gestão de Lojistas
Uma visão em tabela (Dashboard) listando todos os clientes da plataforma, ordenáveis por saldo, uso ou tempo de casa.

**Visão de Cadastro:**
- Nome e E-mail da conta.
- Data de cadastro (Tempo de casa).
- Último pacote comprado (Ex: "Kit Agência Digital").
- Último login/uso ativo.

**Ações de Moderação e Suporte (Gestão de Contas):**
- **Aumentar/Diminuir Créditos:** Ferramenta crucial para suporte (ex: falha na geração, você devolve 1 crédito para o cliente).
- **Suspender Usuário:** Um botão de emergência (Kill Switch) para banir ou pausar contas que estejam burlando o sistema ou com comportamento suspeito (prevenção de fraudes).
- **Visualizar Histórico:** Ver o log de quais imagens aquele usuário gerou nos últimos 7 dias.

---

## 5. Arquitetura de Pagamentos (Integração Mercado Pago)
Como as credenciais do Mercado Pago já estão configuradas no nosso `.env`, o banco de dados precisará refletir isso na infraestrutura:

- **Tabela de Transações (Webhooks):** Além de armazenar os créditos, criaremos uma tabela `transactions` para salvar o ID do pagamento do Mercado Pago (`payment_id`), o status (`approved`, `pending`, `rejected`) e o pacote associado.
- **Liberação Automática:** O webhook do MP acionará uma rota interna que chamará a nossa função RPC (`add_credits`) para liberar os créditos no mesmo segundo em que o PIX for pago.
