# tilleggsstonader-sak-frontend

Frontend for saksbehandling av tilleggsstønader

# Kom i gang med utvikling

For å kunne installere avhengigheter fra navikt registry må man være logget inn i github packages. Kjør kommando:
`npm login --scope=@navikt --registry=https://npm.pkg.github.com`
username er det samme på github og passordet er utvikler-tokenet som er generert i github.
Dersom tokenet allerede er generert, finnes det typisk i m2-settings/gradle.properties fil.

* Installere avhengigheter `yarn && cd src/backend && yarn`
* Bygge server `yarn build:dev`
* Starte dev-server `yarn start:dev` (trenger miljøvariabler, se under)
* Åpne `http://localhost:3000` i nettleseren din

### Client id & client secret

secret kan hentes fra cluster:

1. `gcloud auth login`
2.
`kubectl --context dev-gcp -n tilleggsstonader get secret azuread-tilleggsstonader-sak-frontend-lokal -o json | jq '.data | map_values(@base64d)' | grep CLIENT`

* `AZURE_APP_CLIENT_ID` (fra secret)
* `AZURE_APP_CLIENT_SECRET` (fra secret)

#### .env

Lag en `.env` fil i `src/backend` og legg inn:

```bash
AZURE_APP_CLIENT_ID=<clientId>
AZURE_APP_CLIENT_SECRET=<clientSecret>
```

#### Unleash

Lokalt er unleash mocket. Default er at flagg er enabled. Hvis man ønsker å sette de til false gjøres det i
[unleashMock.ts](./src/frontend/utils/unleashMock.ts)

*

##### Bruke unleash fra lokalt

Hent token mot unleash
`kubectl -n tilleggsstonader get secret tilleggsstonader-sak-frontend-unleash-api-token -o json | jq '.data | map_values(@base64d)' | grep TOKEN`
Legg inn token i `.env`

* `UNLEASH_SERVER_API_TOKEN` (fra secret)
* Start app med `BRUK_UNLEASH=true yarn start:dev`

# Feilsøking

Feilmelding ved oppstart av app:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '<...>/src/backend/build/auth/token' imported from <...>/src/backend/build/server.js 
```

Løsning: Du trenger Node-versjon 20.

##### App vil ikke starte lokalt

Vanlig grunn til at oppstart feiler er at det har skjedd endringer i node-backenden (backend for frontend), og den må da
bygges på nytt.

Løsning: Kjør `yarn build:dev`

# Arkitektur (big picture)

## Oversikt

Dette er en klassisk "backend-for-frontend" (BFF) + SPA:

- **BFF (Node/Express)** i `src/backend/`:
    - Serverer `index.html` og statiske assets i prod.
    - Kjører webpack dev middleware i dev.
    - Terminering av auth og utstedelse av OBO-token.
    - Proxy mot flere interne tjenester.
- **Frontend (React)** i `src/frontend/`:
    - React Router med sider under `src/frontend/Sider/`.
    - App-wide state via `src/frontend/context/`.
    - Feature toggles via Unleash.

## Request-flyt (typisk brukerhandling)

Se `src/backend/server.ts` og `src/backend/proxy.ts`.

## Auth/OBO (hvor du feilsøker)

- `src/backend/auth/token.ts`:
    - `validateToken()` beskytter routes og kan redirecte til login for SPA-routes.
    - `attachToken(application)` utsteder OBO-token (audience fra `miljø.clients[...]`) og setter
      `Authorization: Bearer ...` før proxy.
- `src/backend/auth/client.ts`:
    - Verifiserer JWT med JWKS.
    - Token exchange (OBO) via `openid-client`.
- Lokalt: `src/backend/auth/local.ts` håndterer `/oauth2/login|callback|logout` og lagrer token i session.

## Bygg/deploy

- Frontend prod-build: `webpack/webpack.production.js` → output `dist_production/`.
- BFF dev-build: `src/backend/tsc --build` → output `src/backend/build/`.
- Docker: `Dockerfile` kopierer `src/backend` + `dist_production` og kjører BFF på port 3000.

## Unleash

Frontend bruker `@unleash/proxy-client-react` og henter toggles via BFF på `GET /api/toggle`.

- Lokalt er unleash default mocket (alle flagg enabled). Se `src/frontend/utils/unleashMock.ts`.
- For å bruke ekte Unleash lokalt: sett `BRUK_UNLEASH=true` og legg `UNLEASH_SERVER_API_TOKEN` i `src/backend/.env`.

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.
