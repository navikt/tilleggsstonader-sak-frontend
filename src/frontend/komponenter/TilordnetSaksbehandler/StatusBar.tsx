import styled from 'styled-components';

import { ASurfaceSuccess, ASurfaceNeutral, ASurfaceWarning } from '@navikt/ds-tokens/dist/tokens';

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
            return ASurfaceNeutral;
        case TilordnetSaksbehandlerPåOppgave.INNLOGGET_SAKSBEHANDLER:
        case TilordnetSaksbehandlerPåOppgave.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
            return ASurfaceSuccess;
        case TilordnetSaksbehandlerPåOppgave.ANNEN_SAKSBEHANDLER:
        case TilordnetSaksbehandlerPåOppgave.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER:
            return ASurfaceWarning;
        default:
            return ASurfaceNeutral;
    }
}
