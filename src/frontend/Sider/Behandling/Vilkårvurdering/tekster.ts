import { RegelId } from '../../../typer/regel';

export const svarIdTilTekst: Record<string, string> = {
    JA: 'Ja',
    NEI: 'Nei',

    // PASS_BARN
    TRENGER_MER_TILSYN_ENN_JEVNALDRENDE:
        'Ja, legeerklæring viser at barnet har behov for vesentlig mer pleie/tilsyn',
    FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID:
        'Ja, tiltak/utdanningssted har dokumentert at søker er borte fra hjemmet utover vanlig arbeidstid',
};

export const svarIdTilTekstKorversjon: Record<string, string> = {
    JA: 'Ja',
    NEI: 'Nei',

    // PASS_BARN
    TRENGER_MER_TILSYN_ENN_JEVNALDRENDE:
        'Legeerklæring viser at barnet har behov for vesentlig mer pleie/tilsyn',
    FORSØRGER_HAR_LANGVARIG_ELLER_UREGELMESSIG_ARBEIDSTID:
        'Tiltak/utdanningssted har dokumentert at søker er borte fra hjemmet utover vanlig arbeidstid',
};

export const regelIdTilSpørsmål: Record<RegelId, string> = {
    UTGIFTER_DOKUMENTERT: 'Har bruker dokumenterte utgifter til pass?',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Mottar den andre forelderen støtte til pass av barnet?',
    HAR_FULLFØRT_FJERDEKLASSE: 'Er barnet ferdig med 4. skoleår?',
    UNNTAK_ALDER:
        'Har barnet behov for pass utover 4. skoleår, og er behovet tilfredsstillende dokumentert?',
    NØDVENDIGE_MERUTGIFTER: 'Har søker nødvendige merutgifter til bolig eller overnatting?',
    RETT_TIL_BOSTØTTE: 'Har søker rett til bostøtte?',
};

export const regelIdTilSpørsmålKortversjon: Record<RegelId, string> = {
    UTGIFTER_DOKUMENTERT: 'Dokumentert utgifter?',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Mottar annen forelder støtte?',
    HAR_FULLFØRT_FJERDEKLASSE: 'Ferdig med 4. skoleår?',
    NØDVENDIGE_MERUTGIFTER: 'Har nødvendige merutgifter?',
    UNNTAK_ALDER: 'Unntak fra aldersregelen?',
    RETT_TIL_BOSTØTTE: 'Har søker rett til bostøtte?',
};

export const hjelpetekster: Record<RegelId, string[]> = {
    UTGIFTER_DOKUMENTERT: [
        'Hvis dokumentasjon mangler eller er mangelfull sender du mangelbrev før du gjør vurderingen. Sett saken på vent. Frist er 14 dager frem  i tid.',
        'Faktura fra SFO/AKS må inneholde barnets navn, gjelde for perioden som bruker har fått stønad for og inneholde summen bruker har betalt for pass og hva som er utgifter til kost.',
        'Faktura fra barnehage må i tillegg inneholde eventuelle kostnader til bleier, så det er mulig å trekke dette fra.',
        'Ved privat pass så skal det vurderes om det er sannsynlig at søker har hatt utgifter til barnepass i perioden det søkes for. Avtale mellom barnepasser og søker eller A-melding kan være eksempler på dokumentasjon som godtas. Skjermbilde av betalinger via vipps eller bankutskrift godkjennes ikke. ',
    ],
};
