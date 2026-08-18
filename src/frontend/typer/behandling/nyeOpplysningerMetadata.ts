export type ÅrsakMetadata = {
    kilde: ÅrsakMetadataKilde | undefined;
    beskrivelse: string | undefined;
    endringer: ÅrsakMetadataEndring[];
};

export enum ÅrsakMetadataKilde {
    MODIA = 'MODIA',
    GOSYS = 'GOSYS',
    ETTERSENDING = 'ETTERSENDING',
    OPPFØLGINGSLISTE = 'OPPFØLGINGSLISTE',
    ANNET = 'ANNET',
    ARENA = 'ARENA',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
}

export enum ÅrsakMetadataEndring {
    AKTIVITET = 'AKTIVITET',
    MÅLGRUPPE = 'MÅLGRUPPE',
    UTGIFT = 'UTGIFT',
    ANNET = 'ANNET',
}

export const nyeOpplysningerEndringTilTekst: Record<ÅrsakMetadataEndring, string> = {
    AKTIVITET: 'Aktivitet',
    MÅLGRUPPE: 'Målgruppe',
    UTGIFT: 'Utgift',
    ANNET: 'Annet',
};

export const årsakMetadataKildeeTilTekst: Record<ÅrsakMetadataKilde | string, string> = {
    MODIA: 'Modia',
    GOSYS: 'Gosys',
    ETTERSENDING: 'Ettersending',
    OPPFØLGINGSLISTE: 'Oppfølgingsliste',
    ANNET: 'Annet',
    ARENA: 'Arena',
    PAPIRSØKNAD: 'Papiersøknad',
};
