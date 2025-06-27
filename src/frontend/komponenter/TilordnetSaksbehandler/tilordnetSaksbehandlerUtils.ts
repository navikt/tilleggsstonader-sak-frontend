import { SaksbehandlerDto, SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

export function utledVisningsnavn(ansvarligSaksbehandler: SaksbehandlerDto) {
    switch (ansvarligSaksbehandler.rolle) {
        case SaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
        case SaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
            return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn} (deg)`;
        case SaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
            return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`;
        default:
            return 'ingen ansvarlig';
    }
}
