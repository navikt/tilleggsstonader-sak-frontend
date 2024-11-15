export enum BegrunnelseGrunner {
    MEDLEMSKAP = 'MEDLEMSKAP',
    DEKKET_AV_ANNET_REGELVERK = 'DEKKET_AV_ANNET_REGELVERK',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    LØNNET = 'LØNNET',
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',
    SYKEPENGER_100_PROSENT = 'SYKEPENGER_100_PROSENT',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export const begrunnelseTilTekst: Record<BegrunnelseGrunner, string> = {
    MEDLEMSKAP: 'Medlemskap',
    DEKKET_AV_ANNET_REGELVERK: 'Utgifter dekket av annet regelverk',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    LØNNET: 'Ordinær lønn i tiltaket',
    INGEN_AKTIVITET: 'Ingen aktivitet',
    SYKEPENGER_100_PROSENT: '100% sykepenger',
    INGEN_MÅLGRUPPE: 'Ingen målgruppe',
};
