# 🧪 Gemini Models & Specs (May 2026)

Este documento define os modelos de IA ativos, limites e estratégias de fallback para o Estúdio & Sabor.

## 🤖 Modelos Ativos

| Funcionalidade | Modelo Principal | Modelo Fallback | Notas |
|----------------|------------------|-----------------|-------|
| **Geração de Imagem** | `gemini-2.5-flash-image` | `vertex-ai-imagen-3` | Foco em realismo e texturas de comida. |
| **Copywriting** | `gemini-2.5-flash` | `gemini-1.5-pro` | Otimizado para conversão em português. |
| **Classificação** | `gemini-1.5-flash` | — | Rápido e baixo custo. |
| **Kit Completo** | `unified-kit-v1` | — | Orquestração interna via Gemini 3.0. |

## 💸 Tabela de Custos (USD per 1M tokens)

| Modelo | Input | Output | Image Output (Unit) |
|--------|-------|--------|---------------------|
| Gemini 2.5 Flash | $0.15 | $0.60 | $0.0315 |
| Gemini 1.5 Flash | $0.075 | $0.30 | — |
| Unified Kit V1 | $0.10 | $0.40 | — |

## 🛡️ Circuit Breaker (Budget Safety)
- **Daily Budget**: R$ 150,00 (ajustável em `system_settings`).
- **Exchange Rate**: Cotação em tempo real via AwesomeAPI (sync 24h).
- **Safe Mode**: Bloqueia novas gerações se o budget diário for atingido.

## 📐 Especificações Técnicas
- **Image Resolution**: 1024x1024 (1:1), 1920x480 (4:1), 1080x1920 (9:16).
- **Mime Types**: `image/png`, `image/jpeg`, `image/webp`.
- **Response Format**: JSON schema estrito para descrições de pratos.
