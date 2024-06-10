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
2. `kubectl --context dev-gcp -n tilleggsstonader get secret azuread-tilleggsstonader-sak-frontend-lokal -o json | jq '.data | map_values(@base64d)' | grep CLIENT`

* `AZURE_APP_CLIENT_ID` (fra secret)
* `AZURE_APP_CLIENT_SECRET` (fra secret)

#### .env
Lag en `.env` fil i `src/backend` og legg inn:
```bash
AZURE_APP_CLIENT_ID=<clientId>
AZURE_APP_CLIENT_SECRET=<clientSecret>
```
# Feilsøking
Feilmelding ved oppstart av app: 
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '<...>/src/backend/build/auth/token' imported from <...>/src/backend/build/server.js 
```
Løsning: Du trenger Node-versjon 18. 


##### App vil ikke starte lokalt
Vanlig grunn til at oppstart feiler er at det har skjedd endringer i node-backenden (backend for frontend), og den må da bygges på nytt.

Løsning: Kjør `yarn build:dev`


## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.
