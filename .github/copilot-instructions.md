# Copilot Instructions

Veiledning for AI-verktøy som arbeider med kode i dette repositoriet.

## Kodestil

- Bruk norske kommentarer og kode
- Bruk funksjonelle komponenter med hooks
- Bruker eslint + prettier for linting/formatering, stylelint for CSS
- Bruk named imports, unngå default imports
- Unngå `any`-typer, definer eksplisitte interfaces
- Bruk TypeScript strict mode
- Bruk Navs designsystem (`@navikt/ds-react`, ikoner fra `@navikt/aksel-icons`)
- CSS modules (`.module.css`) er foretrukket over styled-components
- Bruk design tokens fra `@navikt/ds-tokens/darkside-js` med `--ax-`-prefiks
  - eksempel: `ShadowDialog` ↔ `var(--ax-shadow-dialog)`
- Importrekkefølge (håndheves av eslint): react → eksterne → `@navikt/*` → relative imports, med blanke linjer mellom grupper
- Alle imports bruker relative paths (ingen path-aliaser)
- Prettier: 100 printWidth, 4 tab, single quotes, es5 trailing comma

## Kommandoer

```bash
# Installer avhengigheter (to package.json: rot + src/backend)
yarn && yarn --cwd src/backend

# Bygg BFF (må kjøres ved backend-endringer)
yarn build:dev

# Start dev-server på http://localhost:3000
yarn start:dev

# Prod-build (frontend → dist_production/, BFF → src/backend/build/)
yarn build

# Lint alt
yarn lint

# Lint med autofix
yarn lint:fix

# Lint én fil
yarn eslint src/frontend/Sider/MinFil.tsx
```

Node 20 er påkrevd (se `.nvmrc`). Ingen test-rammeverk er konfigurert.

## Arkitektur

BFF (backend-for-frontend) + SPA-arkitektur:

- **`src/backend/`** — Node/Express-server (BFF)
  - Autentisering via Azure AD + OBO-tokens (`auth/`)
  - Proxyer API-kall til `tilleggsstonader-sak` og `tilleggsstonader-klage` (`proxy.ts`)
  - Miljøkonfig i `miljø.ts` (localhost, localhost-preprod, preprod, prod)
  - Feature toggles via Unleash (`toggle.ts`)
  - Webpack dev middleware med HMR i dev-modus

- **`src/frontend/`** — React SPA
  - **`Sider/`** — Sidekomponenter: Oppgavebenk, Personoversikt, Behandling, Journalføring, Klage, Admin
  - **`context/`** — State management med `constate`
  - **`hooks/`** — Custom hooks for API-kall og skjematilstand
  - **`komponenter/`** — Gjenbrukbare UI-komponenter
  - **`typer/`** — TypeScript-typer og interfaces
  - **`utils/`** — Hjelpefunksjoner (fetch, datoformatering, toggles, roller)

## Nøkkelmønstre

### Ressurs-typen

All asynkron data bruker `Ressurs<T>` (diskriminert union):
- `IKKE_HENTET` → `HENTER` → `SUKSESS { data: T }` | `FEILET` | `FUNKSJONELL_FEIL` | `IKKE_TILGANG`
- Hjelpefunksjoner: `byggRessursSuksess()`, `byggRessursFeilet()`, `pakkUtHvisSuksess()`
- `<DataViewer>` håndterer lasting/feil for én eller flere `Ressurs`-objekter i JSX

### API-kall

Alle kall går via `request()` fra `useApp()` (AppContext):
```typescript
const { request } = useApp();
request<ResponseType>('/api/sak/...', 'POST', payload).then(settRessurs);
```
Legger automatisk til `x-request-id` (UUID) for sporing.

### State management

`constate` brukes for context: `const [Provider, useHook] = constate(...)`.
Viktige kontekster: `AppContext` (rot), `BehandlingContext`, `VilkårContext`, `StegContext`.

### Skjemahåndtering

- `useFieldState()` — enkeltfelt med validering (value, onChange, isValid, errorMessage)
- `useFormState()` — flere felter
- `useUlagredeKomponenter()` — sporer ulagrede endringer og blokkerer navigasjon

### Feature toggles

Unleash-flagg definert i `utils/toggles.ts`. Lokalt er alle flagg mocket som enabled (se `utils/unleashMock.ts`).
