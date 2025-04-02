import { RegelId } from '../../../typer/regel';
import { StønadsvilkårType } from '../vilkår';

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
    HØYERE_BOUTGIFTER_SAMMENLIGNET_MED_TIDLIGERE:
        'Har søker dokumentert høyere boutgifter på aktivitetssted sammenlignet med tidligere bolig?',
    NØDVENDIG_Å_BO_NÆRMERE_AKTIVITET: 'Er det nødvendig for søker å bo nærmere aktivitetsstedet?',
    RETT_TIL_BOSTØTTE: 'Har søker rett til bostøtte for boligen de søker om støtte til?',
    HØYERE_UTGIFTER_HELSEMESSIG_ÅRSAKER: 'Har søker høyere utgifter grunnet helsemessige årsaker?',
    DOKUMENTERT_UTGIFTER_BOLIG: 'Har søker dokumentert utgifter til bolig tilfredsstillende?',
};

export const regelIdTilSpørsmålKortversjon: Record<RegelId, string> = {
    UTGIFTER_DOKUMENTERT: 'Dokumentert utgifter?',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Mottar annen forelder støtte?',
    HAR_FULLFØRT_FJERDEKLASSE: 'Ferdig med 4. skoleår?',
    NØDVENDIGE_MERUTGIFTER: 'Har nødvendige merutgifter?',
    UNNTAK_ALDER: 'Unntak fra aldersregelen?',
    HØYERE_BOUTGIFTER_SAMMENLIGNET_MED_TIDLIGERE: 'Høyere utgift på aktivitetssted?',
    NØDVENDIG_Å_BO_NÆRMERE_AKTIVITET: 'Nødvendig å bo nærmere aktivitetssted?',
    RETT_TIL_BOSTØTTE: 'Rett til bostøtte?',
    HØYERE_UTGIFTER_HELSEMESSIG_ÅRSAKER: 'Høyere utgift av helsemessige årsak?',
    DOKUMENTERT_UTGIFTER_BOLIG: 'Dokumentert utgift tilfredsstillende?',
};

export const hjelpetekster: Record<RegelId, string[]> = {
    UTGIFTER_DOKUMENTERT: [
        'Hvis dokumentasjon mangler eller er mangelfull sender du mangelbrev før du gjør vurderingen. Sett saken på vent. Frist er 14 dager frem  i tid.',
        'Faktura fra SFO/AKS må inneholde barnets navn, gjelde for perioden som bruker har fått stønad for og inneholde summen bruker har betalt for pass og hva som er utgifter til kost.',
        'Faktura fra barnehage må i tillegg inneholde eventuelle kostnader til bleier, så det er mulig å trekke dette fra.',
        'Ved privat pass så skal det vurderes om det er sannsynlig at søker har hatt utgifter til barnepass i perioden det søkes for. Avtale mellom barnepasser og søker eller A-melding kan være eksempler på dokumentasjon som godtas. Skjermbilde av betalinger via vipps eller bankutskrift godkjennes ikke. ',
    ],
};

export const vilkårTypeTilUtgiftTekst: Record<StønadsvilkårType, string> = {
    PASS_BARN: 'Månedlig utgift',
    UTGIFTER_OVERNATTING: 'Utgift',
    LØPENDE_UTGIFTER_EN_BOLIG: 'Merutgifter per måned',
    LØPENDE_UTGIFTER_TO_BOLIGER: 'Merutgifter per måned',
};
