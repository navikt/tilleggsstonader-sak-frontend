export type ÅrsakMetadata = {
    kilde: ÅrsakMetadataKilde | undefined;
    beskrivelse: string | undefined;
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
export type NyeOpplysningerEndringer = {
    endringer: NyeOpplysningerEndring[];
};

export enum NyeOpplysningerEndring {
    AKTIVITET = 'AKTIVITET',
    MÅLGRUPPE = 'MÅLGRUPPE',
    UTGIFT = 'UTGIFT',
    ANNET = 'ANNET',
}

export const nyeOpplysningerEndringTilTekst: Record<NyeOpplysningerEndring, string> = {
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
};
