# Stack Tecnológica Recomendada

Recomendação para atingir o MVP descrito no [PRD](../prd/bolao.md), com foco em entrega rápida, baixo custo e manutenção simples para um bolão entre amigos.

## Resumo

| Camada | Tecnologia | Motivo |
|--------|------------|--------|
| Frontend | **Next.js 15** (App Router) + **TypeScript** | Web responsiva, SSR, rotas por link de convite |
| UI | **Tailwind CSS** + **shadcn/ui** | Mobile-first, componentes acessíveis, rápido de iterar |
| Formulários | **React Hook Form** + **Zod** | Validação client + server consistente |
| Backend | **Next.js Route Handlers** + camada de serviços | Lógica de negócio isolada em `src/services/` |
| Banco | **PostgreSQL** via **Supabase** | Relacional, RLS, auth integrado |
| Auth | **Supabase Auth** (e-mail/senha) | Requisito v1; extensível depois |
| ORM | **Drizzle ORM** | Type-safe, migrations versionadas, leve |
| i18n | **next-intl** | pt-BR agora; strings externalizadas |
| Jobs/cron | **Vercel Cron** ou **Supabase Edge Functions** | Sync de placares da API |
| Cache de API | Tabelas `matches`, `competitions` no Postgres | Respeita rate limit; app não bate na API a cada request |
| Hospedagem | **Vercel** (app) + **Supabase** (DB/auth) | Free tier generoso para MVP entre amigos |
| API de futebol | **football-data.org** | Gratuita, estável, cobre Brasileirão e Copa |

## API de futebol — football-data.org

Única fonte de dados automáticos de competições e partidas no MVP (decisão Q3, modo A).

### [football-data.org](https://www.football-data.org/)

- **Custo:** gratuito para competições principais (declarado como permanente pelo projeto).
- **Cobertura free:** Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, **Brasileirão Série A**, **Copa do Mundo**, Eurocopa, entre outras (~12 competições).
- **Dados:** fixtures, resultados, classificação, artilharia (em planos pagos; na v1 campeão/artilheiro é manual pelo criador).
- **Limite free tier:** **máximo 10 chamadas por minuto** — o sync nunca deve exceder essa taxa (throttle ou fila entre requisições).
- **Variável `.env`:** `FOOTBALL_DATA_API_KEY` — registrar em [football-data.org/client/register](https://www.football-data.org/client/register).
- **Uso no app:** job cron sincroniza jogos e resultados 1–4x/dia + após janelas de jogos.

**Regras de implementação:**

1. Nunca chamar a API no page view do usuário — jobs cron leem a API, gravam em `competitions` / `matches` no Postgres e a UI só consulta o banco.
2. **Não fazer mais de 10 chamadas por minuto** à football-data.org (rate limit do free tier).

### Fallback manual (modo B)

Quando não houver API para a competição escolhida (decisão Q3):

- Criador cadastra times, jogos e fases manualmente.
- Criador informa resultados de partidas manualmente.
- Criador informa campeão e artilheiro (regra fixa na v1 — decisão Q22).

No PRD, cadastro manual de competição/jogos e pontuação com resultados manuais são **P0** nesse fluxo (não opcionais para quem escolhe competição manual).

## Arquitetura de alto nível

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Browser    │────▶│  Next.js     │────▶│  PostgreSQL     │
│  (mobile)   │     │  App + API   │     │  (Supabase)     │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
                    ┌──────▼───────┐
                    │ Cron Job     │
                    │ (sync API)   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────────────┐
                    │ football-data.org    │
                    │ (ou entrada manual)  │
                    └──────────────────────┘
```

## Estrutura de pastas sugerida

```
bolao/
├── src/
│   ├── app/                 # Rotas Next.js (pages + API)
│   ├── components/          # UI
│   ├── services/            # Lógica de negócio (bolao, palpites, pontuacao)
│   ├── lib/                 # DB client, validators, utils
│   └── messages/            # i18n (pt-BR.json, en.json futuro)
├── drizzle/                 # Migrations
├── prd/                     # Product Requirements Document
├── docs/                    # Stack, decisões e índice
└── supabase/                # Config local (opcional)
```

## Por que esta stack (e não outras)

### Next.js + Supabase vs. SPA + backend separado

- Um repositório, deploy simples, auth e DB resolvidos.
- Link de convite (`/b/{token}`) funciona bem com App Router.
- Evita over-engineering (sem Kubernetes, sem microserviços).

### PostgreSQL vs. Firebase

- Modelo relacional natural para bolão (participantes, palpites, regras, ranking).
- Queries de ranking e desempate são SQL direto.
- RLS no Supabase isola dados por bolão.

### Drizzle vs. Prisma

- Ambos servem; Drizzle é mais leve e SQL-transparente — útil para queries de ranking.

## Custos estimados (MVP)

| Serviço | Custo MVP |
|---------|-----------|
| Vercel (Hobby) | R$ 0 |
| Supabase (Free) | R$ 0 |
| football-data.org | R$ 0 |
| Domínio | ~R$ 40/ano |

Escala para centenas de usuários sem custo. Milhares de usuários simultâneos exigiria planos pagos.

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Rate limit da API | Máx. **10 chamadas/minuto** à football-data.org; cache no DB; sync por cron, não por request do usuário |
| API sem Brasileirão/Copa em algum momento | Fallback manual já previsto no produto |
| Link vazado (sem limite de participantes) | Token UUID longo; termos de uso; feature futura de limite opcional |
| Posicionamento legal (não ser casa de apostas) | Sem dinheiro no app; copy clara; sem odds; privado por link |

## Roadmap técnico pós-v1

1. Login social (Google)
2. PWA + push notifications
3. E-mail de lembrete antes dos jogos
