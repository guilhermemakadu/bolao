# Bolão entre Amigos — Documentação

App web para bolões privados entre amigos. **Não é casa de apostas** — sem dinheiro, sem apostas reais, apenas ranking e diversão.

## Índice

| Documento | Descrição |
|-----------|-----------|
| [prd/bolao.md](../prd/bolao.md) | Product Requirements Document (v2.0 — formato padrão) |
| [STACK.md](./STACK.md) | Stack tecnológica recomendada e justificativas |
| [DECISIONS.md](./DECISIONS.md) | Registro das decisões de produto (sessão grill-me) |

### API externa

- **[football-data.org](https://www.football-data.org/)** via `FOOTBALL_DATA_API_KEY` — única fonte automática de competições e partidas; **máximo 10 chamadas por minuto**; sync só por cron + cache no DB.

## Visão em uma frase

Amigos criam bolões privados de um torneio, configuram modos de palpite e pontuação, convidam via link, iniciam manualmente — e a partir daí as regras ficam travadas.

## Status

- **Fase:** Fase 0 — scaffold + auth implementados
- **Versão alvo:** v1 (MVP)
- **PRD:** v2.0 em `prd/bolao.md`
- **Idioma:** pt-BR (arquitetura pronta para i18n)
