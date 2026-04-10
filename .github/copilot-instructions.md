# AGENTS.md — tilleggsstonader-sak-frontend

## Repository overview

This repository contains the frontend for saksbehandling av tilleggsstønader. It is a React SPA in `src/frontend/` served by a Node/Express backend-for-frontend in `src/backend/`.

## Tooling

- Package manager: Yarn classic (`yarn`)
- Automation target: Node 24
- Build tooling: TypeScript + webpack
- Validation: ESLint + Stylelint + production build
- There is currently no dedicated automated test command configured at the repo root

## Important paths

- `src/frontend/` — React UI, routes, context, hooks, and shared frontend utilities
- `src/backend/` — Express BFF, auth, proxying, environment handling
- `webpack/` — frontend build configuration
- `.nais/` — deployment manifests
- `dist_development/` and `dist_production/` — generated build output; do not hand-edit

## Setup and validation commands

```bash
yarn ci          # install root and backend dependencies
yarn lint        # eslint + stylelint
yarn build       # lint + frontend production build + backend build
yarn build:dev   # backend build for local development
yarn start:dev   # start local dev server
```

Prefer validating changes with `yarn lint` and `yarn build`. If you only touched backend TypeScript, `yarn --cwd src/backend build` is a quicker compile check.

## Working conventions

- Follow existing TypeScript, React, and Express patterns before introducing new abstractions.
- Reuse existing utilities, context providers, and helpers where possible.
- Keep frontend and backend changes in sync when route contracts, auth flow, proxy behavior, or payload shape changes.
- Update related documentation when local setup or runtime behavior changes.
- Avoid new dependencies unless the current codebase has no good place to extend.
- Use ESLint and Prettier for JavaScript/TypeScript formatting and linting, and Stylelint for CSS.

## Frontend code style

- Use Norwegian for comments and new domain-oriented code naming when it matches the surrounding code.
- Use functional React components with hooks; do not introduce class components.
- Declare React components with `React.FC`: `export const MyComponent: FC<Props> = ({ ... }) => { ... }`.
- Declare standalone utility functions with `function` syntax: `export function myUtil(...) { ... }`.
- Prefer named imports and avoid default imports.
- Avoid `any`; define explicit interfaces or types instead.
- Respect TypeScript strict mode.
- Use NAV Design System components from `@navikt/ds-react` and icons from `@navikt/aksel-icons`.
- Prefer CSS Modules (`.module.css`) over `styled-components`.
- Use design tokens from Aksel through CSS variables with the `--ax-` prefix, for example `var(--ax-shadow-dialog)`.
- Keep imports ordered as: `react`, external packages, `@navikt/*`, then relative imports, with blank lines between groups.

## Backend notes

- Auth and OBO token handling live under `src/backend/auth/`.
- Request wiring and proxy behavior live primarily in `src/backend/server.ts` and `src/backend/proxy.ts`.
- Local auth behavior differs from deployed environments; preserve environment-specific branching unless the change is intentional.

## Frontend notes

- Pages and route-level UI live under `src/frontend/Sider/`.
- Shared state lives under `src/frontend/context/`.
- Feature toggles use Unleash; local defaults are mocked in `src/frontend/utils/unleashMock.ts`.

## Safety rails

### Always

- Run `yarn lint` before handing off changes.
- Run `yarn build` for cross-cutting or production-impacting changes.
- Keep `.nais/` manifests and runtime assumptions aligned when changing ports, env vars, or deployment behavior.

### Ask first

- Changing auth/login flow, proxy targets, or token handling
- Modifying deployment manifests or production configuration
- Adding or replacing core libraries

### Never

- Commit secrets, tokens, or `.env` values
- Hand-edit generated output in `dist_*`
- Claim a test suite passed when no test command exists in the repository
