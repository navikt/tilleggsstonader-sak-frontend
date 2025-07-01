import {
    TilordnetSaksbehandlerDto,
    TilordnetSaksbehandlerPåOppgave,
} from '../../typer/behandling/tilordnetSaksbehandlerDto';

export function utledVisningsnavn(ansvarligSaksbehandler: TilordnetSaksbehandlerDto) {
    switch (ansvarligSaksbehandler.tilordnetSaksbehandlerPåOppgave) {
        case TilordnetSaksbehandlerPåOppgave.INNLOGGET_SAKSBEHANDLER:
        case TilordnetSaksbehandlerPåOppgave.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER:
            return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn} (deg)`;
        case TilordnetSaksbehandlerPåOppgave.ANNEN_SAKSBEHANDLER:
            return `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`;
        default:
            return 'Ingen ansvarlig';
    }
}
