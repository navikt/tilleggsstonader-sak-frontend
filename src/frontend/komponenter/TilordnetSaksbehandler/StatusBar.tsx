import styled from 'styled-components';

import { BorderNeutral, BorderSuccess, BorderWarningSubtle } from '@navikt/ds-tokens/darkside-js';

import { TilordnetSaksbehandlerPåOppgave } from '../../typer/behandling/tilordnetSaksbehandlerDto';

export const StatusBar = styled.span<{ $color: string }>`
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    border-top: 4px solid ${(props) => props.$color};
`;

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
