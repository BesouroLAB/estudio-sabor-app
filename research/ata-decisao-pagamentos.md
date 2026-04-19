# ATA EXECUTIVA: Estratégia de Monetização e Gateway de Pagamento

**Projeto:** Estúdio & Sabor 2.0
**Data:** 18 de Abril de 2026
**Assunto:** Decisão arquitetônica e de negócios para o sistema de cobranças na Fase 1 (Operação Pessoa Física - CPF).

---

## 1. Status Técnico da Infraestrutura
O banco de dados de produção (Supabase) encontra-se **totalmente preparado e implementado**. A engenharia atual suporta tanto o controle de `plan_type` (assinaturas mensais) quanto de `credits` (pacotes avulsos e pré-pagos). A decisão a seguir **não representa** um bloqueio técnico, sendo exclusivamente uma decisão de negócios (Go-to-Market).

## 2. O Gargalo Fiscal Atual
A operação iniciará na modalidade **Pessoa Física (CPF)**, o que inviabiliza temporariamente ou cria altíssima fricção com bancos e gateways dedicados restritamente ao universo B2B (ex: Cora, Iugu, Asaas completo - que costumam exigir CNPJ para escala sem bloqueios).

### Cenários de Gateways Viáveis para Fase 1 (CPF):
| Gateway | Vantagens | Desvantagens |
| :--- | :--- | :--- |
| **Mercado Pago** | Aprovação de conta imediata, aceita CPF sem restrições, domínio nacional, integração rápida, taxa de PIX competitiva (~0.99%). | Sistema de assinaturas nativo é mais complexo de gerenciar escalonamente. |
| **Stripe** | Melhor infraestrutura técnica do mundo e excelente área de ambiente de testes. | Taxas de operação maiores no Brasil; política de bloqueio agressiva caso sua conta CPF gere picos altos de vendas ou estornos frequentes (Chargebacks). |

**Recomendação Técnica:** **Mercado Pago.** Permite validação de demanda real colocando o dinheiro diretamente na sua conta, testando a aceitação do mercado antes da profissionalização contábil completa.

---

## 3. Análise dos Modelos de Negócio (Micro-SaaS)

Diante do mercado brasileiro de *Foodservice/Deliveries*, os especialistas de negócios devem ponderar entre três caminhos para o Produto:

### 💡 Cenário A: Assinatura Mensal (SaaS Clássico)
**A Proposta:** Planos rígidos (Ex: R$ 97/mês acesso ilimitado / 100 processos).
* **Vantagens:** Garante a clássica RMR (Receita Mensal Recorrente) cobiçada no mundo SaaS.
* **Desvantagens em fase inicial (CPF):**
  * Alta taxa de *Chargeback* se operado no Cartão de Crédito (fraudes ou pessoas cancelando).
  * Churn no PIX: Como o PIX ainda não debita automaticamente mensalidades (Pix Recorrente engatinhando), haverá o desafio de cobrar ativamente clientes todo mês, causando evasão.

### 💡 Cenário B: Pacotes de Uso Avulsos (Pay-as-you-go)
**A Proposta:** O cliente entra quando tem demanda e recarrega a carteira (Ex: "Pacote Booster: R$ 49 = 50 fotos/processos de cardápio").
* **Vantagens:** 
  * Alinha-se diretamente ao movimento "*Outcome-based Pricing*" de 2026. A ferramenta se torna um "Insumo" imediato (Comprei, Gerei, Postei no iFood).
  * Vendas via PIX avulso possuem risco ZERO de estorno para o CPF do recebedor.
* **Desvantagens:** Requer mais esforço da marca para fazer o cliente sentir necessidade de comprar um novo pacote no mês seguinte.

### 💡 Cenário C: A Rota Híbrida
**A Proposta:** Planos premium de assinatura anual/cartão para Heavy Users (ex: Assessorias/Agências de iFood) e a vitrine de "Tokens Iniciais via PIX" para o dono de restaurante modesto.

---

## 4. Pautas de Decisão (Ações Requeridas)

Utilize este checklist junto ao seu conselho para destravar a fase de desenvolvimento do financeiro:

- [ ] **Decisão 1:** Qual o Modelo de Venda Principal para o primeiro mês de operação? (Assinatura Recorrente ou Pacote Fechado / Créditos).
- [ ] **Decisão 2:** Aprovação do Mercado Pago como Gateway MVP oficial para operação via CPF na Fase 1.
- [ ] **Decisão 3:** Estimativa de faturamento de corte onde a operação exigirá a abertura de um CNPJ (Simples Nacional/MEI) engatilhando a migração futura para infraestrutura 100% fiscal (Cora/Asaas NFS-e automatizada).

> *Relatório formulado e auditado via Inteligência Técnica do Agente Antigravity para acompanhamento estratégico do Estúdio Sabor.*
