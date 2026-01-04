# WARP.md

Denne filen gir veiledning til copilot og andre AI-verktøy når du arbeider med kode i dette repositoriet.

## Kodestil

- Bruk norske kommentarer og kode
- Bruk funksjonelle komponenter med hooks
- bruker tslint for linting og prettier for formatering
- bruk named imports, unngå default imports
- Unngå `any`-typer, definer eksplisitte interfaces
- Bruk TypeScript strict mode
- Bruk Navs designsystem (@navikt/ds-react)
- CSS modules er foretrukket over styled-components. Bruk `.module.css` filer for styling.
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
