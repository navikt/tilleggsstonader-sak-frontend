import { RegelId, SvarId } from '../../../typer/regel';
import { StønadsvilkårType } from '../vilkår';

export const svarIdTilTekst: Record<SvarId, string> = {
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
    NØDVENDIGE_MERUTGIFTER: 'Har søker nødvendige merutgifter til overnatting?',
    HØYERE_BOUTGIFTER_SAMMENLIGNET_MED_TIDLIGERE:
        'Har søker dokumentert høyere boutgifter på aktivitetssted sammenlignet med tidligere bolig?',
    NØDVENDIG_Å_BO_NÆRMERE_AKTIVITET: 'Er det nødvendig for søker å bo nærmere aktivitetsstedet?',
    RETT_TIL_BOSTØTTE: 'Har søker rett til bostøtte for boligen de søker om støtte til?',
    HØYERE_UTGIFTER_HELSEMESSIG_ÅRSAKER: 'Har søker høyere utgifter grunnet helsemessige årsaker?',
    DOKUMENTERT_UTGIFTER_BOLIG: 'Har søker dokumentert utgifter til bolig tilfredsstillende?',
    DOKUMENTERT_UTGIFTER_OVERNATTING: `Har søker dokumentert utgifter til overnatting tilfredsstillende?`,
    DOKUMENTERT_DELTAKELSE: `Har søker dokumentert at de har samling/eksamen/opptaksprøve/kurs på datoene for overnatting?`,
    AVSTAND_OVER_SEKS_KM: 'Har bruker reiseavstand over seks kilometer?',
    KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT: 'Kan bruker benytte offentlig transport?',
    KAN_BRUKER_KJØRE_SELV: 'Kan bruker kjøre selv?',
};

export const regelIdTilSpørsmålKortversjon: Record<RegelId, string> = {
    UTGIFTER_DOKUMENTERT: 'Dokumentert utgifter?',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Mottar annen forelder støtte?',
    HAR_FULLFØRT_FJERDEKLASSE: 'Ferdig med 4. skoleår?',
    NØDVENDIGE_MERUTGIFTER: 'Har nødvendige merutgifter?',
    DOKUMENTERT_UTGIFTER_OVERNATTING: `Dokumentert utgift tilfredsstillende?`,
    UNNTAK_ALDER: 'Unntak fra aldersregelen?',
    HØYERE_BOUTGIFTER_SAMMENLIGNET_MED_TIDLIGERE: 'Høyere utgift på aktivitetssted?',
    NØDVENDIG_Å_BO_NÆRMERE_AKTIVITET: 'Nødvendig å bo nærmere aktivitetssted?',
    RETT_TIL_BOSTØTTE: 'Rett til bostøtte?',
    HØYERE_UTGIFTER_HELSEMESSIG_ÅRSAKER: 'Høyere utgift av helsemessige årsak?',
    DOKUMENTERT_UTGIFTER_BOLIG: 'Dokumentert utgift tilfredsstillende?',
    DOKUMENTERT_DELTAKELSE: `Dokumentert samling e.l.?`,
    AVSTAND_OVER_SEKS_KM: 'Reiseavstand minst seks kilometer?',
    KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT: 'Kan benytte offentlig transport?',
    KAN_BRUKER_KJØRE_SELV: 'Kan bruker kjøre selv?',
};

export const hjelpetekster: Record<RegelId, string[]> = {
    UTGIFTER_DOKUMENTERT: [
        'Hvis dokumentasjon mangler eller er mangelfull sender du mangelbrev før du gjør vurderingen. Sett saken på vent. Frist er 14 dager frem  i tid.',
        'Faktura fra SFO/AKS må inneholde barnets navn, gjelde for perioden som bruker har fått stønad for og inneholde summen bruker har betalt for pass og hva som er utgifter til kost.',
        'Faktura fra barnehage må i tillegg inneholde eventuelle kostnader til bleier, så det er mulig å trekke dette fra.',
        'Ved privat pass så skal det vurderes om det er sannsynlig at søker har hatt utgifter til barnepass i perioden det søkes for. Avtale mellom barnepasser og søker eller A-melding kan være eksempler på dokumentasjon som godtas. Skjermbilde av betalinger via vipps eller bankutskrift godkjennes ikke. ',
    ],
    NØDVENDIGE_MERUTGIFTER: [
        'Det må vurderes om aktivitetsstedet er i naturlig pendleravstand fra bostedet. Ved vurdering av naturlig pendleravstand skal det blant annet legges vekt på avstanden mellom hjem og aktivitetssted, tilgjengelig transportmidler, reisetid, kostnader og ev. andre forhold knyttet til søker.',
    ],
    NØDVENDIG_Å_BO_NÆRMERE_AKTIVITET: [
        'Det må vurderes om aktivitetsstedet er i naturlig pendleravstand fra bostedet. Ved vurdering av naturlig pendleravstand skal det blant annet legges vekt på avstanden mellom hjem og aktivitetssted, tilgjengelig transportmidler, reisetid, kostnader og ev. andre forhold knyttet til søker.',
    ],
};

export const vilkårTypeTilUtgiftTekst: Record<StønadsvilkårType, string> = {
    PASS_BARN: 'Månedlig utgift',
    UTGIFTER_OVERNATTING: 'Utgift',
    LØPENDE_UTGIFTER_EN_BOLIG: 'Merutgifter per måned',
    LØPENDE_UTGIFTER_TO_BOLIGER: 'Merutgifter per måned',
    DAGLIG_REISE: '',
};

export const vilkårTypeTilUtgiftHjelpeTekst: Record<StønadsvilkårType, string | undefined> = {
    PASS_BARN: undefined,
    UTGIFTER_OVERNATTING: undefined,
    LØPENDE_UTGIFTER_EN_BOLIG:
        'Merutgift utgjør differansen mellom boutgift på aktivitetsstedet og boutgift på tidligere hjemsted. Eventuelle inntekter for utleie av bolig skal ikke være med i beregningen.',
    LØPENDE_UTGIFTER_TO_BOLIGER:
        'Merutgiften tilsvarer utgiften til boligen på aktivitetsstedet, som kommer i tillegg til utgifter til bolig på hjemstedet. Eventuelle inntekter for utleie av bolig skal ikke være med i beregningen.',
    DAGLIG_REISE: undefined,
};

export const vilkårTypeTilTekst: Record<StønadsvilkårType, string> = {
    PASS_BARN: 'Pass av barn',
    UTGIFTER_OVERNATTING: 'Utgifter til overnatting',
    LØPENDE_UTGIFTER_EN_BOLIG: 'Løpende utgifter til en bolig',
    LØPENDE_UTGIFTER_TO_BOLIGER: 'Løpende utgifter til to boliger',
    DAGLIG_REISE: 'Daglig reise',
};
