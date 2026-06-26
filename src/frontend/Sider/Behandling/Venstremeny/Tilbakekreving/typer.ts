export interface TilbakekrevingHendelse {
    hendelseOpprettet: string;
    sakOpprettet: string;
    varselSendtTidspunkt?: string;
    behandlingstatus: string;
    totaltFeilutbetaltBeløp: number;
    tilbakekrevingFom: string;
    tilbakekrevingTom: string;
    tilbakekrevingBehandlingId: string;
    saksbehandlingURL?: string;
}

export const tilbakekrevingstatusTilTekst: Record<string, string> = {
    OPPRETTET: 'Opprettet',
    TIL_BEHANDLING: 'Til behandling',
    TIL_FORHÅNDSVARSEL: 'Til forhåndsvarsel',
    TIL_GODKJENNING: 'Til godkjenning',
    AVSLUTTET: 'Avsluttet',
};
