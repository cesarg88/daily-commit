# Supabase Persistence Notes

This project keeps database schema changes in `supabase/migrations/`.

The first persistence migration introduces:

- founder-owned tables for objectives, days, daily objectives, and closed-day score snapshots;
- `user_id` ownership on founder data;
- Row Level Security on every founder-data table;
- owner-only policies for read, insert, update, and delete paths.

## Environment

Fill these variables in local and preview environments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key must remain server-only.

## Validation

RLS validation checks live in `supabase/validation/rls-checks.sql`.

Run `npm run validate:persistence` to apply the migration in a local validation database and execute the persistence checks end to end.

The SQL checks are designed to validate:

- anonymous access denial;
- owner-only read and write access;
- rejection of inserts and updates that try to write another user's `user_id`.

`npm run validate:persistence` requires a local PostgreSQL runtime at `/opt/homebrew/opt/postgresql@17/bin`.
