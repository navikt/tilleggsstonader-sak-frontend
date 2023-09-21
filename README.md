# tilleggsstonader-sak-frontend
Frontend for saksbehandling av tilleggsstønader

# Kom i gang med utvikling

* Installere avhengigheter `yarn`
* Bygge server `yarn build:dev`
* Starte dev-server `yarn start:dev`
* Åpne `http://localhost:3000` i nettleseren din

For å kunne installere avhengigheter fra navikt registry må man være logget inn i github packages. Kjør kommando:
`npm login --scope=@navikt --registry=https://npm.pkg.github.com`
username er det samme på github og passordet er utvikler-tokenet som er generert i github.
Dersom tokenet allerede er generert, finnes det typisk i m2-settings/gradle.properties fil.

### Client id & client secret
secret kan hentes fra cluster:
1. `gcloud auth login`
2. `kubectl -n tilleggsstonader get secret azuread-tilleggsstonader-sak-frontend-lokal -o json | jq '.data | map_values(@base64d)' | grep CLIENT`

* `AZURE_APP_CLIENT_ID` (fra secret)
* `AZURE_APP_CLIENT_SECRET` (fra secret)

#### .env
Lag en `.env` fil i `src/backend` og legg inn:
```bash
AZURE_APP_CLIENT_ID=<clientId>
AZURE_APP_CLIENT_SECRET=<clientSecret>
```