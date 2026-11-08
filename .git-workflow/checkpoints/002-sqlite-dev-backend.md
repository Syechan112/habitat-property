# Checkpoint 002 - SQLite Development Backend

## Summary
Added local-only SQLite API and public image upload flow for development testing.

## Changed Files
- `dev-server/db.ts`
- `dev-server/server.ts`
- `dev-server/seed.ts`
- `src/services/auth-local.ts`
- `src/app/providers/auth-provider.tsx`
- `package.json`
- `package-lock.json`
- `.gitignore`
- `TODOS.md`

## Verification
- `npx tsx dev-server/seed.ts` passed.
- `npm run build` passed.
- `npm run dev:api` starts API on port 3001.

## Pending
- Wire buyer property discovery to local API.
- Add property CRUD, inquiry, viewing, and admin approval flows.
- Add upload UI and API client.
