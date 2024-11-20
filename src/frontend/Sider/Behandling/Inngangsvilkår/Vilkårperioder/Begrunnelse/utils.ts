export enum BegrunnelseGrunner {
    //Målgruppe
    MEDLEMSKAP = 'MEDLEMSKAP',
    DEKKET_AV_ANNET_REGELVERK = 'DEKKET_AV_ANNET_REGELVERK',
    SYKEPENGER_100_PROSENT = 'SYKEPENGER_100_PROSENT',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',

    // Aktivitet felles
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',

    // Barnetilsyn
    LØNNET = 'LØNNET',

    // Læremidler
    HAR_UTGIFTER = 'HAR_UTGIFTER',
}

export const begrunnelseTilTekst: Record<BegrunnelseGrunner, string> = {
    MEDLEMSKAP: 'Medlemskap',
    DEKKET_AV_ANNET_REGELVERK: 'Utgifter dekket av annet regelverk',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    LØNNET: 'Ordinær lønn i tiltaket',
    INGEN_AKTIVITET: 'Ingen aktivitet',
    SYKEPENGER_100_PROSENT: '100% sykepenger',
    INGEN_MÅLGRUPPE: 'Ingen målgruppe',
    HAR_UTGIFTER: 'Hvorfor bruker ikke har utgifter',
};
