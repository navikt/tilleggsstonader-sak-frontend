---
name: migrate-styled-components-to-css-modules
description: Migrering fra styled-components til CSS Modules
---

Hjelp med å migrere fra styled-components og inline styling til CSS Modules.

- Du skal spørre om hvilke mapper eller filer som skal migreres.
- Utfør alle endringer i en komponent inkriminelt, altså migrer ferdig en komponent før du går til neste.

For hver komponent som ønskes konvertert:
- Opprett .module.css fil ved siden av komponenten
- Importer stilene som: import styles from './ComponentName.module.css'
- Fjern styled-components importen når den ikke lenger brukes

Kodestil:
- bruk kebab case i CSS-filer og camel case i typescript imports
- Ikke bruk inline-style
- bruk design tokens fra @navikt/ds-tokens/darkside-js, der variablene er prefikset med `--ax-`,
    - eksempel: `ShadowDialog` <-> `var(--ax-shadow-dialog)`
- hvis det er flere stiler samtidig, bruk src/frontend/utils/classNames.ts
