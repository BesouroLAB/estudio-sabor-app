# **Pilar 5: Viabilidade Financeira e Arquitetura de Lucro (2026)**

## **1. A Matemática do Sucesso: Unit Economics**

Em abril de 2026, a viabilidade de um Micro-SaaS B2B no Brasil depende de uma única métrica: o custo para servir cada cliente precisa ser uma fração minúscula do que ele paga. 

### **Desdobramento de Custos por Cliente (Plano R$ 49,00):**
*   **Processamento de Imagem (Fal.ai + Flux.1 Dev + ControlNet):** US$ 0,025 x 30 fotos = US$ 0,75 (~R$ 4,12).
*   **Refinamento visual (Upscale Real-ESRGAN):** US$ 0,01 x 30 fotos = US$ 0,30 (~R$ 1,65).
*   **Cérebro Semântico (Gemini 2.5 Flash-Lite):** US$ 0,10 por 1M tokens (Custo irrisório por 30 descrições).
*   **Gateway de Pagamento (Asaas - Pix/Cartão):** Taxa média de 5% = R$ 2,45.
*   **Infraestrutura (Supabase/Vercel Edge):** R$ 2,00 (diluído).

**TOTAL COGS (Custo do Produto Vendido): R$ 10,95**
**MARGEM BRUTA: 77,3% (R$ 38,05 por cliente)**

---

## **2. Estratégia de Preços: "A Compra por Impulso B2B"**

Em 2026, não queremos que o lojista "pense" para contratar. O preço tem que ser menor que um erro de pedido no rush.

1.  **Plano Essencial (R$ 49,00/mês):** 
    *   Focado no lojista individual ("Dono-Design").
    *   30 fotos e 30 descrições.
    *   Argumento: *"Custa menos que 2 taxas de entrega por mês."*
2.  **Plano Profissional/Redes (R$ 89,00/mês):**
    *   Focado em Redes de Franquias ou Dark Kitchens multi-marcas.
    *   100 fotos e 100 descrições.
    *   Argumento: *"A gestão visual de toda a sua rede pelo preço de uma pizza."*

---

## **3. A Stack Tecnológica (2026 Standard)**

Para manter essa margem, não podemos ter servidores ligados 24h. Tudo é **Serverless e Edge**.

*   **Motor de Imagem:** `Fal.ai` (Performance 4x superior às APIs da OpenAI/Replicate em 2026).
*   **Motor de Texto & Visão:** `Gemini 3.1 Flash` (Usa a foto do celular do cara para "ver" o que tem no prato e gerar o texto 100% fiel).
*   **Banco de Dados & Auth:** `Supabase` (Foco em segurança e velocidade de resposta).
*   **Pagamentos:** `Asaas API` (Foco total no PIX brasileiro, com conciliação automática e custo zero de recebimento no Pix para novos negócios).

---

## **4. O Ponto de Equilíbrio (Break-even)**

Como o custo fixo de infraestrutura é de apenas ~US$ 20,00 (R$ 110,00), o negócio se paga com apenas **3 clientes ativos**. 
*   **Cenário 100 clientes:** Faturamento R$ 4.900,00 | Lucro Líquido: ~R$ 3.500,00.
*   **Cenário 1.000 clientes:** Faturamento R$ 49.000,00 | Lucro Líquido: ~R$ 35.000,00.

---

## **5. Mitigação de Riscos 2026**
*   **Volatilidade do Dólar:** Nossos custos de API são em dólar. Mantemos uma reserva de margem de 78%. Se o dólar explodir (acima de R$ 7,00), o sistema reduz automaticamente a franquia de fotos de 30 para 25 para proteger o caixa do SaaS.
*   **Bloqueio de Plataforma:** Não dependemos de uma única IA. Se a Fal.ai cair, o sistema tem fallback automático para a `Imagen 4` do Google Cloud.

---
*Estúdio & Sabor 2.0 - Tecnologia robusta para um lucro real.*