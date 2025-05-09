export type NyeOpplysningerMetadata = {
    kilde: NyeOpplysningerKilde | undefined;
    endringer: NyeOpplysningerEndring[];
    beskrivelse: string | undefined;
};

export enum NyeOpplysningerKilde {
    MODIA = 'MODIA',
    GOSYS = 'GOSYS',
    ETTERSENDING = 'ETTERSENDING',
    OPPFØLGINGSLISTE = 'OPPFØLGINGSLISTE',
    ANNET = 'ANNET',
}

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

export const nyeOpplysningerKildeTilTekst: Record<NyeOpplysningerKilde | string, string> = {
    MODIA: 'Modia',
    GOSYS: 'Gosys',
    ETTERSENDING: 'Ettersending',
    OPPFØLGINGSLISTE: 'Oppfølgingsliste',
    ANNET: 'Annet',
};
