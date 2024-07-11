// VEDTAK
export enum VedtakValg {
    OMGJØR_VEDTAK = 'OMGJØR_VEDTAK',
    OPPRETTHOLD_VEDTAK = 'OPPRETTHOLD_VEDTAK',
}

export const vedtakValgTilTekst: Record<VedtakValg, string> = {
    OMGJØR_VEDTAK: 'Omgjør vedtak',
    OPPRETTHOLD_VEDTAK: 'Oppretthold vedtak',
};

// ÅRSAK
export enum ÅrsakOmgjøring {
    FEIL_I_LOVANDVENDELSE = 'FEIL_I_LOVANDVENDELSE',
    FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_PROSESSUELL = 'FEIL_PROSESSUELL',
    ANNET = 'ANNET',
}

export const årsakValgTilTekst: Record<ÅrsakOmgjøring, string> = {
    FEIL_I_LOVANDVENDELSE: 'Feil lovanvendelse',
    FEIL_REGELVERKSFORSTÅELSE: 'Feil regelverksforståelse',
    FEIL_ELLER_ENDRET_FAKTA: 'Feil eller endret fakta',
    FEIL_PROSESSUELL: 'Prosessuell feil',
    ANNET: 'Annet',
};
