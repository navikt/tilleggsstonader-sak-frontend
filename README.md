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