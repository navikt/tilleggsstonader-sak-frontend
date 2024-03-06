import { RegelId } from '../../../typer/regel';

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

export const regelIdTilSpørsmål: Record<RegelId, string> = {
    UTGIFTER_DOKUMENTERT: 'Er utgifter til pass tilfredsstillende dokumentert?',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Mottar den andre forelderen støtte til pass av barnet?',
    HAR_ALDER_LAVERE_ENN_GRENSEVERDI: 'Er barnet ferdig med 4. skoleår?',
    UNNTAK_ALDER:
        'Har barnet behov for pass utover 4. skoleår, og er behovet tilfredsstillende dokumentert?',
};

export const regelIdTilSpørsmålsbeskrivelse: Record<RegelId, string> = {
    UTGIFTER_DOKUMENTERT: 'Hva skal stå her?🤷‍',
    ANNEN_FORELDER_MOTTAR_STØTTE: 'Dette inkluderer både søker og foresatt',
};
