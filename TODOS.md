# TODOS - HABITAT Properties

## Setup & Architecture
- [x] Set up project-level AGENTS.md using workspace-skill-orchestrator <!-- id: 1 -->
- [x] Scaffold React + TypeScript + Vite project in root <!-- id: 2 -->
- [x] Install Tailwind CSS v4 using official Vite plugin (@tailwindcss/vite) <!-- id: 3 -->
- [x] Install core dependencies (@tanstack/react-query, zustand, react-router, react-hook-form, zod, @supabase/supabase-js, lucide-react) <!-- id: 4 -->
- [x] Set up directory structure according to PRD section 6 <!-- id: 5 -->
- [x] Create .env.example and .env <!-- id: 6 -->
- [x] Verify build and dev server scripts <!-- id: 7 -->

## Development Test Backend
- [x] Replace Supabase runtime services with local SQLite API for development <!-- id: 16 -->
- [x] Add local image upload endpoint writing files to `public/uploads/` <!-- id: 17 -->
- [x] Seed local test data and define development start command <!-- id: 18 -->
- [x] Verify local auth and property data flows <!-- id: 19 -->

## Phase 4: Buyer Inquiry & Viewing
- [x] Persist viewing date and time in inquiry records
- [x] Implement seller dashboard & property CRUD functionality (create, list, patch status, delete)

## Phase 3: Buyer Property Discovery
- [x] Add property API client and map local SQLite response fields <!-- id: 20 -->
- [x] Add responsive buyer property listing with loading, error, and empty states <!-- id: 21 -->
- [x] Add property search and filters (location, price, type) <!-- id: 22 -->
- [x] Add property detail page <!-- id: 23 -->
- [x] Add saved properties and comparison (maximum 3) <!-- id: 24 -->

## Phase 2: Authentication & Role Routing
- [x] Initialize shadcn/ui with Tailwind v4 and add base UI components (button, input, label, card) <!-- id: 8 -->
- [x] Add Supabase client config and auth service <!-- id: 9 -->
- [x] Add Zustand auth store (user, session, role, login, logout) <!-- id: 10 -->
- [x] Add Auth provider and protected role routes (React Router) <!-- id: 11 -->
- [x] Add login and register pages with Zod validation <!-- id: 12 -->
- [x] Add role-based redirect after login and role layouts <!-- id: 13 -->
- [x] Wire main.tsx with providers and router <!-- id: 14 -->
- [x] Run build/lint and verify no critical errors <!-- id: 15 -->
