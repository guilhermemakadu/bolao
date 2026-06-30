# Bolão entre Amigos

App web para bolões privados entre amigos. **Não é casa de apostas** — sem dinheiro, só ranking e diversão.

## Stack

- Next.js 15 (App Router) + TypeScript
- Supabase Auth (e-mail/senha)
- PostgreSQL + Drizzle ORM
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- next-intl (pt-BR)

## Pré-requisitos

- Node.js 20+
- Projeto Supabase com Auth habilitado

## Configuração local

1. Clone o repositório e instale dependências:

```bash
npm install
```

2. Copie as variáveis de ambiente:

```bash
cp .env.example .env
```

3. Preencha `.env` com credenciais do Supabase:

- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chave anon/public
- `DATABASE_URL` — connection string PostgreSQL (pooler Supabase)

4. Aplique a migration inicial:

```bash
npm run db:push
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Testes (Vitest) |
| `npm run lint` | ESLint |
| `npm run db:generate` | Gerar migration Drizzle |
| `npm run db:push` | Aplicar schema no banco |

## Estrutura

```
src/
├── app/           # Rotas Next.js
├── components/    # UI (shadcn/ui)
├── services/      # Lógica de negócio
├── db/            # Drizzle schema e client
├── lib/           # Supabase, validators, utils
└── messages/      # i18n (pt-BR)
```

## Documentação

- [PRD](prd/bolao.md)
- [Stack](docs/STACK.md)
- [Índice docs](docs/README.md)
