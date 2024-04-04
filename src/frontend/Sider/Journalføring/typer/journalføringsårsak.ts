export enum Journalføringsårsak {
    DIGITAL_SØKNAD = 'DIGITAL_SØKNAD',
    ETTERSENDING = 'ETTERSENDING',
    IKKE_VALGT = 'IKKE_VALGT',
    KLAGE = 'KLAGE',
    KLAGE_TILBAKEKREVING = 'KLAGE_TILBAKEKREVING',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
}

export const journalføringsårsakTilTekst: Record<Journalføringsårsak, string> = {
    DIGITAL_SØKNAD: 'Digital søknad',
    ETTERSENDING: 'Ettersending',
    IKKE_VALGT: 'Ikke valgt',
    KLAGE: 'Klage',
    KLAGE_TILBAKEKREVING: 'Klage',
    PAPIRSØKNAD: 'Papirsøknad',
};
