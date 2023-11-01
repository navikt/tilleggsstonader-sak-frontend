export const regelIdTilTekst: Record<string, string> = {
    // MÅLGRUPPE
    MÅLGRUPPE: 'Tilhører bruker riktig målgruppe?',

    // AKTIVITET
    ER_AKTIVITET_REGISTRERT: 'Er bruker registrert med en aktivitet?',

    // PASSBARN
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

    // PASSBARN
    TRENGER_MER_TILSYN_ENN_JEVNALDRENDE:
        'Ja, barnet har fullført fjerde skoleår og det er dokumentert at barnet trenger vesentlig mer tilsyn enn jevnaldrende',
    FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID:
        'Ja, barnet har fullført fjerde skoleår og det er dokumentert at forsørgeren har langvarig og/eller uregelmessig arbeidstid',
};
