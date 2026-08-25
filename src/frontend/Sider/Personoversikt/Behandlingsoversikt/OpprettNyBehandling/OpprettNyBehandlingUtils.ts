import { ÅrsakMetadata } from '../../../../typer/behandling/nyeOpplysningerMetadata';

export enum OpprettNyBehandlingType {
    ORDINAER_BEHANDLING = 'ORDINAER_BEHANDLING',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
    KJØRELISTE = 'KJØRELISTE',
}

export const opprettNyBehandlingTypeTilTekst: Record<OpprettNyBehandlingType, string> = {
    ORDINAER_BEHANDLING: 'Ordinær behandling',
    KLAGE: 'Klage',
    TILBAKEKREVING: 'Tilbakekreving',
    KJØRELISTE: 'Kjørelistebehandling',
};

export const tomÅrsakMetadata: ÅrsakMetadata = {
    kilde: undefined,
    beskrivelse: undefined,
    endringer: [],
};
