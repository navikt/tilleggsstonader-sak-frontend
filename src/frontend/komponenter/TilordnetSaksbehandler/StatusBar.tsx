import React from 'react';

import { BorderNeutral, BorderSuccess, BorderWarningSubtle } from '@navikt/ds-tokens/darkside-js';

import styles from './StatusBar.module.css';
import { TilordnetSaksbehandlerPåOppgave } from '../../typer/behandling/tilordnetSaksbehandlerDto';

export const StatusBar: React.FC<{ color: string }> = ({ color }) => {
    return <span className={styles.statusBar} style={{ borderTopColor: color }} />;
};

export function utledStatusbarFarge(
    ansvarligSaksbehandlerRolle: TilordnetSaksbehandlerPåOppgave | undefined
) {
    switch (ansvarligSaksbehandlerRolle) {
        case TilordnetSaksbehandlerPåOppgave.IKKE_SATT:
        case TilordnetSaksbehandlerPåOppgave.UTVIKLER_MED_VEILDERROLLE:
            return BorderNeutral;
        case TilordnetSaksbehandlerPåOppgave.INNLOGGET_SAKSBEHANDLER:
        case TilordnetSaksbehandlerPåOppgave.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
            return BorderSuccess;
        case TilordnetSaksbehandlerPåOppgave.ANNEN_SAKSBEHANDLER:
        case TilordnetSaksbehandlerPåOppgave.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER:
            return BorderWarningSubtle;
        default:
            return BorderNeutral;
    }
}
