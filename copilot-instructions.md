# WARP.md

Denne filen gir veiledning til copilot og andre AI-verktøy når du arbeider med kode i dette repositoriet.

## Kodestil
- Bruk funksjonelle komponenter med hooks
- bruker tslint for linting og prettier for formatering
- bruk named imports 
- Unngå `any`-typer, definer eksplisitte interfaces
- Norske kommentarer og kode
- Bruk TypeScript strict mode
- Bruk Navs designsystem (@navikt/ds-react)
- CSS modules er foretrukket over styled-components. Bruk `.module.css` filer for styling.
- bruk kebab case for selectors i CSS-filer
- bruk design tokens fra @navikt/ds-tokens/darkside-js, der variablene er prefikset med `--ax-`,
  - eksempel: `ShadowDialog` <-> `var(--ax-shadow-dialog)`

## Viktige kommandoer (daglig bruk)

### Installere avhengigheter
Dette repoet har to `package.json` (rot + `src/backend`). Installer begge:

```bash
# Fra repo-root
npm login --scope=@navikt --registry=https://npm.pkg.github.com

yarn
yarn --cwd src/backend
```

### Starte lokalt (dev)
Dev-serveren er Node/Express (BFF) som også kjører webpack dev middleware (HMR) for frontend.

```bash
# Bygg TypeScript i BFF (må ofte kjøres hvis backend-endringer)
yarn build:dev

# Start lokalt (ENV=localhost)
yarn start:dev

# Start lokalt men proxier mot preprod-endepunkter (ENV=localhost-preprod)
yarn start:dev-preprod
```
Åpne `http://localhost:3000`.

### Bygge (prod)
Bygger frontend til `dist_production/` og bygger backend til `src/backend/build/`.

```bash
yarn build
```

### Lint/format

```bash
# Lint alt under src/
yarn lint

# Autofix
yarn lint:fix

# Kun én fil/mappe (kjør eslint direkte)
yarn eslint src/frontend/App.tsx
```

### Tester
Det finnes ingen egen `test`-script i `package.json` per i dag (ingen Jest/Vitest/Playwright-oppsett).

### Vanlige feilmeldinger
- `Error [ERR_MODULE_NOT_FOUND] ... src/backend/build/...`: typisk at BFF ikke er bygget eller feil Node-versjon.
  - Løsning: kjør `yarn build:dev` og bruk Node 20.

## Lokal konfigurasjon (ENV, auth, Unleash)

### ENV (routing av proxier)
BFF leser `process.env.ENV` og velger miljø i `src/backend/miljø.ts`:
- `ENV=localhost` (default i `yarn start:dev`) proxier mot lokale tjenester (f.eks. sak på `http://localhost:8101/api`).
- `ENV=localhost-preprod` (i `yarn start:dev-preprod`) proxier mot dev/preprod-URLer.
- `ENV=preprod` / `ENV=prod` brukes i NAIS/cluster-kontekst.

### Azure client id/secret for lokal auth
I dev brukes lokal login-flow (`/oauth2/login` → `/oauth2/callback`) som lagrer token i session.
Du trenger derfor:
- `AZURE_APP_CLIENT_ID`
- `AZURE_APP_CLIENT_SECRET`

Legg dem i `src/backend/.env`:

```bash
AZURE_APP_CLIENT_ID=<clientId>
AZURE_APP_CLIENT_SECRET=<clientSecret>
```

### Unleash
Frontend bruker `@unleash/proxy-client-react` og henter toggles via BFF på `GET /api/toggle`.
- Lokalt er unleash default mocket (alle flagg enabled). Se `src/frontend/utils/unleashMock.ts`.
- For å bruke ekte Unleash lokalt: sett `BRUK_UNLEASH=true` og legg `UNLEASH_SERVER_API_TOKEN` i `src/backend/.env`.

## Arkitektur (big picture)
### Oversikt
Dette er en klassisk "backend-for-frontend" (BFF) + SPA:
- **BFF (Node/Express)** i `src/backend/`:
  - Serverer `index.html` og statiske assets i prod.
  - Kjører webpack dev middleware i dev.
  - Terminering av auth og utstedelse av OBO-token.
  - Proxy mot flere interne tjenester.
- **Frontend (React)** i `src/frontend/`:
  - React Router (v7) med sider under `src/frontend/Sider/`.
  - App-wide state via `src/frontend/context/`.
  - Feature toggles via Unleash.

### Request-flyt (typisk brukerhandling)
Se `src/backend/server.ts` og `src/backend/proxy.ts`.

### Auth/OBO (hvor du feilsøker)
- `src/backend/auth/token.ts`:
  - `validateToken()` beskytter routes og kan redirecte til login for SPA-routes.
  - `attachToken(application)` utsteder OBO-token (audience fra `miljø.clients[...]`) og setter `Authorization: Bearer ...` før proxy.
- `src/backend/auth/client.ts`:
  - Verifiserer JWT med JWKS.
  - Token exchange (OBO) via `openid-client`.
- Lokalt: `src/backend/auth/local.ts` håndterer `/oauth2/login|callback|logout` og lagrer token i session.

## Bygg/deploy (relevant for runtime-feil)
- Frontend prod-build: `webpack/webpack.production.js` → output `dist_production/`.
- BFF dev-build: `src/backend/tsc --build` → output `src/backend/build/`.
- Docker: `Dockerfile` kopierer `src/backend` + `dist_production` og kjører BFF på port 3000.
