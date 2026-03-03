# Supabase Development Workflow

This repository uses Supabase with a checked-in `supabase/` directory. Do not re-run initialization destructively.

## Prerequisites

- Node.js LTS (Node 20 via `.nvmrc`)
- Docker Desktop running
- Supabase CLI installed
- pnpm installed

## One-Time Setup

```bash
pnpm install
supabase login
```

If `supabase/config.toml` is missing, initialize only once with:

```bash
supabase init --workdir supabase
```

Link the local directory to a hosted project:

```bash
supabase link --workdir supabase --project-ref <your-project-ref>
```

## Local Stack Lifecycle

```bash
pnpm supabase:start
pnpm supabase:status
pnpm supabase:stop
```

## Migrations

Create a new migration:

```bash
pnpm supabase:migration:new <migration_name>
```

Push migrations to the linked remote project:

```bash
pnpm supabase:db:push
```

## Type Generation

Generate database types from local Supabase:

```bash
pnpm supabase:types
```

Generate database types from the linked remote project:

```bash
pnpm supabase:types:linked
```

Types are generated at `packages/supabase/src/database.types.ts`.

## Security Notes

- Never commit secrets.
- Keep secrets in local environment files only.
- Browser code must only use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
