# Development Journal - HABITAT Properties

## 2026-11-09 - Project Init & Local SQLite Dev Environment

### Decisions & Milestones
- **Project Structure**: Initialized with React, Vite, TypeScript, and Tailwind CSS v4 using the official `@tailwindcss/vite` plugin.
- **Testing SQLite Adapter**: Created a local express + SQLite (`better-sqlite3`) API on port 3001 to replace Supabase in local development/testing.
- **Image Upload Flow**: Integrated local disk upload storage writing to `public/uploads/` via Multer, matching Cloudinary fields (`url`, `publicId`).
- **Authentication**: Setup local JWT/bcrypt auth with mock seed accounts (`buyer@habitat.test`, `seller@habitat.test`, `admin@habitat.test`).
- **Database Tables**: Added `users`, `properties`, `inquiries`, and `images` tables with SQLite constraints and foreign keys.
