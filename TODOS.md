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

## Phase 7: Full Local Storage Architecture & Client-Side Resizing (Zero Cloud Dependencies)
- [x] Client-side HTML5 Canvas image resizer & WebP converter (`src/utils/image-resizer.ts`)
- [x] Device Storage Manager (`src/services/device-storage.ts`) using localStorage & initial dataset
- [x] Zero-token, zero-cloud architecture (Cloudinary & Supabase credentials fully optional)
- [x] Standalone offline & static hosting compatibility for Buyer discovery, Seller CRUD, and Admin approval flow
- [x] Seller upload pipeline with automatic client-side compression (saves ~80-90% payload)

## Phase 8: Final Audit & Responsive Polish
- [x] Apply UI/UX visual polish to public, buyer, seller, and admin surfaces
- [x] Full visual redesign using @ui-ux-design-pro across landing, auth, buyer, seller, and admin surfaces <!-- id: 25 -->
- [x] Finish shared UI primitives with tactile glassmorphism and sub-pixel borders <!-- id: 26 -->
- [x] Redesign Landing Page with 3D Focus Stage and editorial bento sections <!-- id: 27 -->
- [x] Redesign Login and Register pages with split editorial auth layout <!-- id: 28 -->
- [x] Reset shared UI primitives and clean @theme configuration <!-- id: 29 -->
- [x] Extract shared layout components (Header, Footer, AuthLayout, DashboardLayout) <!-- id: 30 -->
- [x] Refactor LandingPage to use global Header/Footer via router <!-- id: 31 -->
- [x] Refactor LoginPage to use AuthLayout wrapper (no inline header) <!-- id: 32 -->
- [x] Refactor RegisterPage to use AuthLayout wrapper (no inline header) <!-- id: 33 -->
- [x] Redesign buyer property discovery, detail, compare, and viewing surfaces with Bento Grid <!-- id: 34 -->
- [x] Redesign seller and admin dashboards with high-density bento architecture <!-- id: 30 -->
- [x] Refactor LandingPage into modular components (HeroSection, MetricBanner, BentoFeatures, FeaturedProperties, ClosingCTA) <!-- id: 35 -->
- [x] Modularize all features and layouts to under 200 lines (Buyer, Seller, Admin, Layout, UI) <!-- id: 36 -->
- [x] Run responsive, accessibility, lint, and production build verification <!-- id: 31 -->
- [ ] Add success/error toast notifications for all CRUD actions
- [ ] Final security audit (JWT expiry, role-based RLS simulation)
- [ ] Performance optimization (Image lazy loading, bundle size check)
- [ ] Final build verification and PRD compliance check

## Phase 5: Seller Dashboard & Property CRUD
- [x] Add seller API client with property and inquiry management
- [x] Implement seller dashboard with summary statistics
- [x] Add property CRUD (Create, Read, Update Status, Delete)
- [x] Implement seller inquiry/lead management view

## Phase 6: Admin Dashboard & Approval
- [x] Add admin API client for user and platform management
- [x] Implement admin dashboard with overview statistics
- [x] Add user management table (list, delete)
- [x] Implement property approval workflow (pending, approve, reject)
- [x] Add global inquiry monitoring for admin

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
