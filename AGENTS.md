# HABITAT Properties Project Instructions

## Project Context

- Product: property discovery and management platform for Buyer, Seller, and Admin roles.
- Stack: React, TypeScript, Vite, Tailwind CSS v4, Supabase, Cloudinary.
- Planned libraries: React Router, TanStack Query, Zustand, React Hook Form, Zod, Lucide React.
- Source organization follows `PRD.md`: `src/app`, `src/components`, `src/features`, `src/hooks`, `src/services`, `src/stores`, `src/config`, `src/schemas`, `src/types`, `src/utils`, and `src/constants`.
- Keep feature logic modular. Keep external service communication in `src/services`. Keep reusable UI in `src/components/ui`.
- Protect Supabase data with RLS. Never expose Supabase service role keys or Cloudinary API secrets in frontend environment variables.

## Validation

- Use `npm run build` for production build validation.
- Use `npm run dev` for local development.
- Run available lint or test scripts from `package.json` when present. Do not claim checks that were not run.

## Automatic Skill Routing

Classify each request before acting. Load only installed skills needed for current task; user need not name skills manually. Use smallest sufficient combination, reuse findings, skip heavyweight orchestration for trivial work, and respect global instructions plus this file.

- Project understanding: `project-intelligence`
- Change impact: `change-impact-analyzer`
- Multi-step work: `precision-task-planner`
- Source implementation: `surgical-code-editor`
- Bug investigation: `root-cause-investigator`
- Regression verification: `regression-guardian`
- Frontend or visual design: `design-fidelity-engineer`
- Performance investigation: `performance-detective`
- API, data, or interface contracts: `contract-integrity`
- Final delivery review: `delivery-gatekeeper`

Routing priorities:

- User intent selects primary workflow; project context selects implementation details; risk selects extra verification.
- Explicit constraints override optional workflows.
- Read-only requests trigger no edits.
- Bug fix: `root-cause-investigator`, then `surgical-code-editor` if fix requested, plus `regression-guardian` when relevant.
- UI work: `design-fidelity-engineer`, plus `surgical-code-editor` for source edits and `regression-guardian` when behavior may change.
- API/data contract work: `contract-integrity`, plus `change-impact-analyzer`, `surgical-code-editor`, and applicable `regression-guardian`.
- Complex feature: `project-intelligence` when context lacks, `change-impact-analyzer` when dependencies matter, `precision-task-planner`, `surgical-code-editor`, and `delivery-gatekeeper`.

Use native skill loading before specialized workflows. Never pretend unavailable skills loaded. Do not reload unchanged instructions. Keep loading proportional to task complexity. Always read `TODOS.md` before development tasks. Automatically load `git-workflow-automation` only when Git workflow management is relevant. Do not require manual skill invocation.
