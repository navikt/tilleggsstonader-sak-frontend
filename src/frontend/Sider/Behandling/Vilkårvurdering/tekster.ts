export const regelIdTilTekst: Record<string, string> = {
    // MÅLGRUPPE
    MÅLGRUPPE: 'Tilhører bruker riktig målgruppe?',
    NEDSATT_ARBEIDSEVNE: 'Har bruker nedsatt arbeidsevne etter §11 A-3?',
    OMSTILLINGSSTØNAD_LEDD: 'Etter hvilket ledd er stønaden vurdert?',

    // AKTIVITET
    ER_AKTIVITET_REGISTRERT: 'Er bruker registrert med en aktivitet?',
    LØNN_GJENNOM_TILTAK: 'Mottar bruker lønn gjennom aktivitet?',
    MOTTAR_SYKEPENGER_GJENNOM_AKTIVITET: 'Mottar bruker sykepenger gjennom aktivitet?',

    // PASS_BARN
    DEKKES_UTGIFTER_ANNET_REGELVERK: 'Dekkes utgiftene av annen lovgivning enn folketrygden?',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Mottar den andre forelderen støtte til pass av barnet?',
    UTGIFTER_DOKUMENTERT: 'Er utgifter til pass tilfredstillende dokumentert?',
    HAR_ALDER_LAVERE_ENN_GRENSEVERDI: 'Er barnet ferdig med 4. skoleår?',
    UNNTAK_ALDER:
        'Har barnet behov for pass utover 4. skoleår, og er behovet tilfredsstillende dokumentert?',
    PASS_BEHOV_DOKUMENTERT: 'Behov for pass tilfredsstillende dokumentert?',
};

export const svarIdTilTekst: Record<string, string> = {
    JA: 'Ja',
    NEI: 'Nei',

    // MÅLGRUPPE
    FØRSTE_LEDD: 'Første ledd',
    ANDRE_LEDD: 'Andre ledd',

    // PASS_BARN
    TRENGER_MER_TILSYN_ENN_JEVNALDRENDE:
        'Ja, legeerklæring viser at barnet har behov for vesentlig mer pleie/tilsyn',
    FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID:
        'Ja, tiltak/utdanningssted har dokumentert at søker er borte fra hjemmet utover vanlig arbeidstid',
};
