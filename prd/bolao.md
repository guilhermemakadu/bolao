# PRD — Bolão entre Amigos

**Versão:** 2.0  
**Data:** 14/06/2026  
**Status:** Atual (formato padrão; consolidado com DECISIONS.md)

---

## Problem Statement

Grupos de amigos, família e colegas organizam bolões de futebol de forma informal — geralmente por WhatsApp e planilhas. Esse modelo é frágil: regras ficam ambíguas, palpites se perdem em conversas, prazos não são respeitados de forma justa, o ranking exige cálculo manual e a visibilidade dos palpites gera desconfiança ou spoiler antes da hora.

Quem organiza o bolão (o criador) precisa coordenar tudo na mão. Quem participa quer uma experiência simples, justa e divertida, sem parecer uma casa de apostas. Hoje não existe uma ferramenta dedicada que resolva isso de ponta a ponta para bolões **privados**, **sem dinheiro**, com regras configuráveis e ranking automático.

## Solution

Um app web responsivo onde amigos criam bolões **privados** vinculados a uma competição de futebol, configuram modos de palpite (placar exato, resultado e extras de torneio) e regras de pontuação, convidam participantes via link único, iniciam o bolão manualmente (congelando regras e composição do grupo) e competem por ranking atualizado automaticamente.

O produto **não envolve dinheiro** — é ranking e diversão entre conhecidos. Competições e resultados de partidas vêm de uma API de futebol quando disponível; quando não, o criador cadastra e informa resultados manualmente. Campeão e artilheiro (modo C) são sempre validados manualmente pelo criador na v1.

## User Stories

### Autenticação e conta

1. As a new user, I want to create an account with email and password, so that I can create or join private pools.
2. As a returning user, I want to log in with email and password, so that I can access my pools.
3. As a user who forgot my password, I want to recover my password via email, so that I can regain access to my account.
4. As a logged-in user, I want to update my display name in profile settings, so that other participants can identify me in rankings.
5. As a user, I want to be required to have an account before creating or joining a pool, so that participation is traceable and fair.

### Dashboard e navegação

6. As a logged-in user, I want to see a dashboard listing pools I created and pools I participate in, so that I can quickly return to active bolões.
7. As a logged-in user, I want to distinguish pools by status (draft, open, in progress, archived), so that I know what actions are available in each.
8. As a user, I want the interface in Brazilian Portuguese, so that the experience feels natural for the target audience.
9. As a user on mobile, I want a responsive interface that works well on small screens, so that I can palpitar and check rankings on the go.

### Criação de bolão — wizard

10. As a pool creator, I want to start a new pool in draft status while completing a creation wizard, so that I can configure everything before opening it to participants.
11. As a pool creator, I want to choose one competition for my pool, so that all predictions relate to the same tournament.
12. As a pool creator, I want to select which prediction modes to activate (exact score, result, champion/top scorer), so that the pool matches how my group likes to play.
13. As a pool creator, I want to configure points awarded for each type of correct prediction, so that scoring reflects our group's preferences.
14. As a pool creator, I want to configure a tiebreaker rule (default: most exact scores), so that tied rankings are resolved fairly.
15. As a pool creator, I want to give my pool a name and optional description, so that participants understand what the bolão is about.
16. As a pool creator, I want the pool to transition to OPEN status when I complete the wizard, so that I can invite friends and optionally start predicting before officially starting the pool.
17. As a pool creator, I want to be automatically added as a participant when I create a pool, so that I compete alongside everyone else without extra steps.
18. As a pool creator, I want to continue editing pool rules while status is OPEN, so that I can adjust configuration before locking everything in.
19. As a pool creator, I want to delete a pool freely while it is in DRAFT or OPEN status, so that I can abandon a bolão that was never meant to run.

### Competições e jogos

20. As a pool creator, I want to pick a competition from an API-backed catalog (e.g. Brasileirão, World Cup), so that fixtures and results sync automatically.
21. As a pool creator, I want to manually register a competition and its matches when no API coverage exists, so that my group can still run a bolão on any tournament.
22. As a pool creator choosing manual competition, I want to register teams and match schedule, so that participants have games to predict on.
23. As a participant, I want to see the list of matches for my pool's competition with kickoff times, so that I know when to submit predictions.
24. As a participant, I want match status to reflect reality (scheduled, live, finished, postponed, cancelled), so that I understand which games are still open for prediction.
25. As the system, I want to sync fixtures and results from the football API via scheduled jobs, so that scores update without manual intervention when API is available.
26. As the system, I want to cache competition and match data in the database, so that API rate limits are respected and pages load quickly.

### Convite e participação

27. As a pool creator, I want a unique invite link generated for my pool, so that I can share it with friends on WhatsApp or other channels.
28. As a friend receiving an invite link, I want to land on a page that explains the pool and prompts login or signup, so that I can join with minimal friction.
29. As a logged-in user visiting an invite link, I want to be automatically added to the pool, so that I don't need creator approval.
30. As a participant, I want to join only while the pool is OPEN (not yet started), so that the group composition is fair and locked once play begins.
31. As a participant, I want to leave a pool voluntarily before it starts, so that I'm not forced to stay if I change my mind.
32. As a participant, I want no public listing or search of pools, so that bolões remain private and discoverable only by link.
33. As a pool creator, I want no limit on the number of participants, so that large friend groups can all join.
34. As the system, I want invite tokens to be non-sequential and cryptographically strong (UUID v4+), so that pools cannot be guessed or scraped.

### Início do bolão

35. As a pool creator, I want a clear "Start pool" action with confirmation, so that I intentionally lock rules and membership when we're ready.
36. As a pool creator, I want rules to become immutable for everyone (including myself) after starting, so that no one can change the game mid-way.
37. As a pool creator, I want membership to be locked after starting, so that no one joins or leaves once competition is underway.
38. As a participant, I want to still submit predictions while the pool is OPEN (before official start), so that I can get ahead — understanding rules may still change until the creator starts.
39. As a participant in an OPEN pool, I want a visible warning that rules can still change before start, so that I understand the risk of predicting early.
40. As a participant, I want the pool to remain OPEN indefinitely if the creator never clicks start, so that we're not blocked — but with predictions hidden and rules still editable by the creator.

### Modo A — placar exato

41. As a participant in a pool with exact-score mode, I want to predict the full score (e.g. Brazil 2–1 Croatia) for each match, so that I can earn exact-score points.
42. As a participant, I want to edit my exact-score prediction until match kickoff, so that I can adjust before the deadline.
43. As a participant who misses the deadline, I want to receive zero points for that match but remain in the pool, so that one missed game doesn't eliminate me.
44. As the system, I want to award exact-score points only when both home and away goals match the official result, so that scoring is objective.

### Modo B — resultado

45. As a participant in a pool with result-only mode, I want to predict home win, draw, or away win, so that I can compete without guessing exact scores.
46. As a participant in a pool with only mode B active, I want to submit result without entering a score, so that the form is simpler.
47. As a participant, I want to edit my result prediction until match kickoff, so that I can change my mind before lock.
48. As the system, I want to award result points when the predicted outcome matches the official outcome, so that partial credit is given for correct tendency.

### Modos A + B combinados

49. As a participant in a pool with both exact score and result modes, I want to enter a full score that implicitly defines the result, so that one input covers both modes.
50. As the system, I want exact-score and result scoring to be mutually exclusive per match, so that participants don't double-dip on the same game.
51. As the system, I want to award only exact-score points when the full score is correct, so that the higher reward takes precedence.
52. As the system, I want to award only result points when the score is wrong but the outcome is correct, so that participants still get partial credit.
53. As the system, I want to award zero points when both score and result are wrong, so that incorrect predictions are not rewarded.

### Modo C — campeão e artilheiro

54. As a participant in a pool with tournament extras mode, I want to predict the tournament champion, so that I can earn bonus points at the end.
55. As a participant, I want to predict the top scorer of the tournament, so that I can compete on individual performance too.
56. As a participant, I want exactly one answer per category (champion, top scorer), so that rules are clear and comparable.
57. As a participant, I want to edit champion and top-scorer predictions until kickoff of the first match, so that I have time to decide before the tournament begins.
58. As a participant who doesn't submit mode C predictions, I want zero points on those categories but remain in the pool, so that missing extras doesn't remove me from ranking.
59. As a pool creator, I want to manually register the official champion and top scorer after the tournament ends, so that mode C scoring is applied correctly in v1.
60. As the system, I want to award full configured points for a correct champion/top-scorer prediction and zero for incorrect, so that extras scoring is binary and simple.
61. As a pool creator, I want the pool to stay IN_PROGRESS until I register champion and top scorer (when mode C is active), so that I'm reminded to complete final validation.

### Visibilidade de palpites

62. As a participant, I want all predictions hidden from other participants before the pool officially starts, so that early picks don't influence others.
63. As a participant, I want match predictions hidden until each match's kickoff (after pool has started), so that no one copies others before lock.
64. As a participant, I want champion and top-scorer predictions hidden until kickoff of the first match (after pool has started), so that tournament-long picks stay secret until play begins.
65. As a participant, I want to see all locked predictions from other participants after each deadline passes, so that we can compare and discuss results.
66. As a participant, I want to always see my own predictions, so that I can review and edit them before deadline.

### Deadlines e edição

67. As a participant, I want match prediction deadlines tied to official kickoff time, so that everyone has the same cutoff.
68. As a participant, I want champion/top-scorer deadlines tied to first match kickoff, so that tournament extras are locked when play starts.
69. As the system, I want to reject prediction edits after deadline, so that late changes are impossible.
70. As the system, I want postponed matches to reopen the prediction window until the new kickoff, so that participants can adjust for rescheduled games.
71. As the system, I want cancelled matches to award zero points to everyone for that match, so that void games don't distort ranking.

### Pontuação e ranking

72. As a participant, I want my points calculated automatically when match results are available via API, so that ranking updates without manual work.
73. As a participant in a manual competition, I want points calculated when the creator enters match results, so that scoring still works without API.
74. As a participant, I want to see an updated ranking after each processed match, so that I can track my position throughout the tournament.
75. As a participant, I want tiebreaker rules applied when total points are equal, so that rankings have a clear order.
76. As a participant, I want the default tiebreaker to be most exact scores, so that the most precise predictors rank higher when configured as default.
77. As a participant, I want ranking to recalculate after the creator registers champion and top scorer, so that mode C points are included before final archive.
78. As a participant, I want the final ranking frozen and read-only after archive, so that the bolão has a permanent record.

### Ações do criador — resultados manuais

79. As a pool creator in a manual competition, I want to enter the final score for each match, so that the system can score predictions.
80. As a pool creator, I want to register champion and top scorer when the tournament ends, so that mode C predictions are scored.
81. As a pool creator with mode C active, I want a persistent reminder while the pool is IN_PROGRESS after all matches end, so that I don't forget final validation.
82. As a pool creator, I want the pool to archive automatically only when all matches are finished/cancelled AND champion/top scorer are registered (if mode C), so that closure is complete.

### Ciclo de vida e arquivamento

83. As a participant, I want the pool to move to ARCHIVED when all completion conditions are met, so that we have a clear end state.
84. As a participant, I want archived pools to preserve full history of predictions and results, so that we can revisit the bolão later.
85. As a participant, I want no changes to scores or predictions after archive, so that the final record is trustworthy.
86. As a pool creator, I want to view but not modify an archived pool, so that historical bolões remain intact.

### Experiência nas telas principais

87. As a user, I want a login/signup screen with email and password, so that I can authenticate quickly.
88. As a user, I want a "Create pool" wizard screen (competition → modes → points → tiebreaker → name), so that setup is guided step by step.
89. As a participant, I want a pool detail screen showing ranking, matches, predictions, and creator actions, so that everything for one bolão is in one place.
90. As a participant, I want a dedicated predictions screen listing matches with inputs per active mode, so that submitting picks is efficient.
91. As a friend, I want an invite landing page at a short URL path with token, so that joining from a shared link is seamless.
92. As a user, I want a basic settings page for profile name, so that I can personalize my identity.

### Requisitos não-funcionais e confiança

93. As a user, I want pages to load in under 3 seconds on 4G, so that the app feels snappy on mobile networks.
94. As a user, I want all traffic over HTTPS, so that my credentials and data are protected.
95. As a user, I want clear copy that this is not a betting platform and involves no money, so that I understand the product's nature.
96. As a product owner, I want no notifications in v1, so that scope stays focused on core bolão mechanics.
97. As a developer, I want strings externalized for i18n, so that additional languages can be added later without rewriting UI.

## Implementation Decisions

### Plataforma e arquitetura

- **Web responsiva** (navegador) como única plataforma na v1 — mobile-first, sem app nativo ou PWA instalável.
- **Monorepo Next.js** com App Router: frontend e API no mesmo projeto; link de convite em rota dedicada (`/b/{token}`).
- **Camada de serviços** isolada para lógica de negócio (bolão, palpites, pontuação, ranking); rotas de API delegam aos serviços.
- **PostgreSQL** via Supabase como banco relacional; **Supabase Auth** para e-mail/senha.
- **Drizzle ORM** para schema type-safe e migrations versionadas.
- **Hospedagem:** Vercel (app) + Supabase (DB/auth); cron jobs para sync de API.

### Integração com API de futebol

- **Fonte primária:** football-data.org (gratuita) — fixtures e resultados para competições do catálogo free (inclui Brasileirão Série A, Copa do Mundo, ligas europeias principais).
- **Estratégia de sync:** job cron (1–4x/dia + após janelas de jogos), nunca por request do usuário; dados cacheados em tabelas `competitions` e `matches`.
- **Fallback manual:** quando competição não tem cobertura API, criador cadastra times, jogos e informa resultados; fluxo manual é P0 para quem escolhe essa opção.
- **API secundária opcional futura:** API-Football para competições fora do catálogo — não dependência do MVP.
- **Campeão e artilheiro:** sempre entrada manual pelo criador na v1, independente de API.

### Modelo de dados conceitual

- **User:** id, email, name, created_at.
- **Competition:** id, name, source (api|manual), external_id, season, status.
- **Match:** id, competition_id, home_team, away_team, kickoff_at, home_score, away_score, status (scheduled|live|finished|postponed|cancelled).
- **Pool:** id, creator_id, competition_id, name, slug_token, status (draft|open|active|archived), rules_json (modos ativos, pontos por tipo, desempate), started_at, archived_at.
- **PoolMember:** pool_id, user_id, joined_at, left_at (nullable); criador inserido automaticamente na criação.
- **Prediction:** id, pool_id, user_id, match_id (nullable para modo C), type (exact_score|result|champion|top_scorer), value_json, submitted_at, updated_at.
- **Standing:** pool_id, user_id, total_points, exact_scores, results, rank, tiebreaker_data — materializado ou view recalculada.

### Máquina de estados do bolão

```
DRAFT → OPEN → IN_PROGRESS → ARCHIVED
          │
          └─ deletável em DRAFT e OPEN
```

| Status | Significado | Criador | Participantes |
|--------|-------------|---------|---------------|
| DRAFT | Wizard incompleto | Editar, excluir | — |
| OPEN | Wizard concluído; aguardando início | Editar regras, excluir, iniciar | Entrar, sair, palpitar (ocultos) |
| IN_PROGRESS | Após "Iniciar bolão" | Resultados manuais; registrar campeão/artilheiro | Palpitar até deadlines; ver ranking |
| ARCHIVED | Condições de encerramento satisfeitas | Somente leitura | Somente leitura |

### Modos de palpite e pontuação

| Modo | Código | Input | Pontuação |
|------|--------|-------|-----------|
| Placar exato | A | Gols mandante × visitante | Pontos configuráveis (ex.: 5) |
| Resultado | B | Vitória mandante / empate / vitória visitante | Pontos configuráveis (ex.: 3) |
| Extras de torneio | C | Campeão + artilheiro | Pontos configuráveis por item |

- Modo C na v1 cobre **apenas campeão e artilheiro** — fases eliminatórias fora de escopo.
- Modos A + B na mesma partida: pontuação **mutuamente exclusiva** — acerto de placar dá só pontos A; erro de placar + acerto de resultado dá só pontos B; ambos errados = 0.
- Desempate configurável pelo criador; padrão = mais placares exatos.

### Regras de visibilidade

| Fase | Partidas (A/B) | Campeão/artilheiro (C) |
|------|----------------|------------------------|
| Antes de iniciar bolão | Ocultos | Ocultos |
| Após iniciar, antes do deadline | Ocultos até kickoff de cada jogo | Ocultos até kickoff do 1º jogo |
| Após deadline | Visíveis para todos do bolão | Visíveis para todos do bolão |

### Deadlines

| Tipo | Deadline | Se não palpitar |
|------|----------|-----------------|
| Partidas (A/B) | Kickoff do jogo | 0 pts; permanece no bolão |
| Campeão/artilheiro (C) | Kickoff do 1º jogo | 0 pts; permanece no bolão |

- Palpite único por categoria (campeão, artilheiro), editável até o deadline — não significa envio irreversível.

### Encerramento e arquivamento

Bolão transita para ARCHIVED somente quando **ambas** condições são verdadeiras:

1. Todos os jogos da competição estão `finished` ou `cancelled`.
2. Se modo C ativo, criador registrou campeão **e** artilheiro.

Enquanto condição 2 não for atendida (com modo C), bolão permanece IN_PROGRESS com indicador para o criador.

### Jogos adiados/cancelados

- **Adiado/antecipado:** nova data de kickoff; janela de palpite reabre até novo kickoff.
- **Cancelado definitivamente:** partida anulada; 0 pontos para todos naquela partida.

### Regras de negócio consolidadas

- Apenas o criador define regras de pontuação e modos; após iniciar, regras imutáveis para todos (incluindo criador).
- Um bolão = uma competição.
- Sem transações financeiras no app.
- Bolão descoberto apenas por link (sem busca pública).
- Conta obrigatória (e-mail/senha) para criar e participar.
- Criador é participante automático.
- Entrada de novos participantes bloqueada após bolão iniciado; saída voluntária permitida apenas antes de iniciar.
- Palpites permitidos em OPEN; regras podem mudar até o criador iniciar — participante assume esse risco.
- Validação de campeão/artilheiro sempre manual pelo criador.
- Tokens de convite não sequenciais (UUID v4+).

### Prioridades de requisitos (MVP)

| Área | P0 | P1 |
|------|----|----|
| Auth | Cadastro, login | Recuperação de senha |
| Bolão | CRUD, modos, pontos, desempate, convite, iniciar, excluir, arquivar | — |
| Competições | Catálogo API, sync automático, adiamento/cancelamento | — |
| Competições manuais | Cadastro manual, resultados manuais | — (P0 só no fluxo manual) |
| Palpites | Todos os modos, edição até deadline, visibilidade, exclusividade A+B | — |
| Ranking | Cálculo automático (API), manual (sem API), desempate, congelamento | — |
| Convite | Entrada automática via link, saída antes de iniciar, bloqueio pós-início | — |

### Métricas de sucesso (MVP)

| Objetivo | Métrica |
|----------|---------|
| Criar bolão rapidamente | Tempo médio de criação < 5 min em testes |
| Convite sem fricção | Entrada via link em ≤ 3 cliques (com conta) |
| Regras imutáveis após início | 0 alterações de regra pós-início no sistema |
| Ranking automático (jogos) | Pontuação recalculada sem intervenção manual quando há API |
| Ranking completo (modo C) | Campeão/artilheiro pontuados após confirmação manual do criador |

### UI e formulários

- **Tailwind CSS** + **shadcn/ui** para componentes acessíveis.
- **React Hook Form** + **Zod** para validação client-side e server-side.
- **next-intl** para i18n; pt-BR na v1.

### Fases de entrega sugeridas

| Fase | Entrega | Duração |
|------|---------|---------|
| 0 | Setup stack + auth + DB | ~1 semana |
| 1 | CRUD bolão + regras + convite | 1–2 semanas |
| 2 | Palpites + visibilidade + deadlines | 1–2 semanas |
| 3 | Integração API + pontuação + ranking | 1–2 semanas |
| 4 | Fallback manual + campeão/artilheiro + arquivamento | ~1 semana |
| 5 | Polish UI mobile + testes com amigos | ~1 semana |

**Total MVP estimado:** 6–8 semanas (1 dev).

## Out of Scope

- Dinheiro, PIX, carteira, prêmios financeiros ou qualquer transação financeira
- Posicionamento como casa de apostas, odds ou live betting
- Notificações (e-mail, push) na v1
- Login social (Google, Apple)
- App nativo iOS/Android
- PWA instalável
- Listagem pública ou busca de bolões
- Rede social pública de bolões
- Chat entre participantes
- Múltiplas competições no mesmo bolão
- Limite de participantes
- Aprovação manual de entrada no bolão
- Regras extras (bônus por sequência de acertos, penalidades)
- Prazos customizados por tipo de palpite (deadlines são fixos: kickoff do jogo / kickoff do 1º jogo)
- Palpites de fases eliminatórias no modo C (semifinalistas, finalistas, etc.)
- Fallback automático para iniciar bolão se o criador não agir
- Recuperação de senha como P0 (é P1)

## Further Notes

### O que o produto NÃO é

Para evitar confusão legal e de posicionamento: não é casa de apostas, não é plataforma de apostas com dinheiro real, não é rede social pública de bolões, não é app de odds ou live betting.

### Público-alvo

Grupos de amigos, família ou colegas que já fazem bolão informal e querem uma ferramenta simples, justa e divertida — sem complexidade de apostas reais.

### Riscos de produto e mitigações

| Risco | Mitigação |
|-------|-----------|
| Confusão com casa de apostas | Copy clara; sem dinheiro; bolão privado por link |
| Criador não inicia o bolão | UX com botão destacado; estado visível; participantes podem palpitar em OPEN |
| Criador não confirma campeão/artilheiro | Bolão permanece IN_PROGRESS; banner persistente para o criador |
| API indisponível | Fallback manual de competição e resultados |
| Link vazado | Token forte (UUID); termos de uso; limite de participantes como feature futura opcional |
| Palpites em OPEN com regras mutáveis | Aviso na UI antes de iniciar; participante assume risco |

### Custos estimados (MVP)

Vercel Hobby, Supabase Free e football-data.org free tier cobrem o MVP sem custo de infra — apenas domínio (~R$ 40/ano). Escala para centenas de usuários no free tier.

### Roadmap pós-v1 (referência, não escopo)

Login social, PWA + push, API-Football paga para mais competições, e-mail de lembrete antes dos jogos, palpites de fases eliminatórias no modo C, limite opcional de participantes.

### Documentação relacionada

- [docs/DECISIONS.md](../docs/DECISIONS.md) — decisões da sessão grill-me (25 perguntas) + esclarecimentos pós-revisão
- [docs/STACK.md](../docs/STACK.md) — stack tecnológica detalhada e justificativas
- [docs/README.md](../docs/README.md) — índice da documentação do projeto
