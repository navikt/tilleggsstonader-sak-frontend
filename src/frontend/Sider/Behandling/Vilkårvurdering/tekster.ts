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
    DEKKES_UTGIFTER_ANNET_REGELVERK: 'Dekkes utgifter av annet regelverk?',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Mottar den andre forelderen støtte for dette barnet?',
    UTGIFTER_DOKUMENTERT: 'Er utgiftene tilfredstillende dokumentert?',
    HAR_ALDER_LAVERE_ENN_GRENSEVERDI: 'Har barnet fullført 4. skoleår?',
    UNNTAK_ALDER: 'Oppfylles unntak etter å ha fullført 4. skoleår?',
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
        'Ja, barnet har fullført fjerde skoleår og det er dokumentert at barnet trenger vesentlig mer tilsyn enn jevnaldrende',
    FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID:
        'Ja, barnet har fullført fjerde skoleår og det er dokumentert at forsørgeren har langvarig og/eller uregelmessig arbeidstid',
};
