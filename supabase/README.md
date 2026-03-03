# Supabase Local Development

## Prerequisites

- Docker Desktop running
- Supabase CLI installed

## Start Local Stack

```bash
supabase start
supabase db reset
```

`supabase db reset` applies all migrations in `supabase/migrations` and runs `supabase/seed.sql`.

## Apply New Migration

```bash
supabase migration new <name>
```

Then place SQL changes in the new migration file and run:

```bash
supabase db reset
```
