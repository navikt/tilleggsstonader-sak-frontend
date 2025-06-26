import styled from 'styled-components';

import { ASurfaceSuccess, ASurfaceNeutral, ASurfaceWarning } from '@navikt/ds-tokens/dist/tokens';

import { SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

export const StatusBar = styled.span<{ $color: string }>`
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    border-top: 4px solid ${(props) => props.$color};
`;

export function utledStatusbarFarge(ansvarligSaksbehandlerRolle: SaksbehandlerRolle | undefined) {
    switch (ansvarligSaksbehandlerRolle) {
        case SaksbehandlerRolle.IKKE_SATT:
        case SaksbehandlerRolle.UTVIKLER_MED_VEILDERROLLE:
            return ASurfaceNeutral;
        case SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
            return ASurfaceSuccess;
        case SaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER:
            return ASurfaceWarning;
        default:
            return ASurfaceNeutral;
    }
}
