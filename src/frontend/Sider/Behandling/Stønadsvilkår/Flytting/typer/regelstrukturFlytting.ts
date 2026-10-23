import { TypeVilkårFaktaFlytting } from './faktaFlytting';
import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export enum RegelIdFlytting {
    HAR_UTGIFTER_TIL_FLYTTING = 'HAR_UTGIFTER_TIL_FLYTTING',
    HVILKEN_FORBINDELSE_FLYTTER_BRUKER = 'HVILKEN_FORBINDELSE_FLYTTER_BRUKER',
    MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET = 'MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET',
    FLYTTER_IFBM_ARBEID_ETTER_AKTIVITET = 'FLYTTER_IFBM_ARBEID_ETTER_AKTIVITET',
    MÅ_FLYTTE_FOR_Å_STARTE_I_ARBEID = 'MÅ_FLYTTE_FOR_Å_STARTE_I_ARBEID',
    HVORDAN_SKAL_BRUKER_FLYTTE = 'HVORDAN_SKAL_BRUKER_FLYTTE',
}

export const begrunnelseHjelpeteksterForFlytteforbindelse: Partial<Record<SvarId, string>> = {
    FLYTTING_VED_OPPSTART_ELLER_AVSLUTNING_AV_TILTAK_ELLER_UTDANNING:
        'Beskriv hvilket arbeidsrettet tiltak eller hvilken godkjent utdanning brukeren skal delta/har deltatt i, og oppgi start- og sluttdato for tiltaket eller utdanningen.',
    ARBEID_ETTER_GJENNOMFØRT_AKTIVITET:
        'Beskriv hvilket arbeidsrettet tiltak eller hvilken godkjent utdanning brukeren har gjennomført, og oppgi start- og sluttdato for tiltaket eller utdanningen.',
    ENSLIG_FORSØRGER_ELLER_GJENLEVENDE_STARTER_I_ARBEID:
        'Dette alternativet gjelder bare for enslig forsørger eller gjenlevende. Det er ikke et krav at personen har gjennomført aktivitet. Forklar her hvorfor bruker flytter, ettersom det ikke er i forbindelse med en aktivitet.',
};

export const begrunnelseHjelpeteksterForFlytterIfbmArbeid: Partial<Record<SvarId, string>> = {
    JA: 'Vurder om det er nødvendig for bruker å flytte. Ta hensyn til naturlig pendleravstand, arbeidsforholdets varighet, arbeidskontrakt for det nye arbeidsforholdet, jobbsøk på hjemstedet og om stillingen er utlyst eller meldt til Nav.',
};

export const begrunnelseHjelpeteksterForMåFlytteForStarteArbeid: Partial<Record<SvarId, string>> = {
    JA: 'Vurder naturlig pendleravstand, arbeidsforholdets varighet, arbeidskontrakt for det nye arbeidsforholdet, jobbsøk på hjemstedet og om stillingen er utlyst eller meldt til Nav.',
};

export const delvilkårHjelpetekster: Partial<Record<RegelIdFlytting, string>> = {
    [RegelIdFlytting.HAR_UTGIFTER_TIL_FLYTTING]:
        'Vurder om bruker faktisk har utgifter til flyttingen. Dersom flyttingen er gratis eller utgiftene dekkes fullt ut på annen måte, har ikke bruker utgifter som kan dekkes.',
    [RegelIdFlytting.MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET]:
        'Dersom bruker flyttet til aktivitetssted for å gjennomføre, kan de ha rett på å flytte hjem også',
};

export interface SvaralternativFlytting {
    svarId: SvarId;
    nesteRegelId?: RegelIdFlytting | null;
    begrunnelseType: BegrunnelseRegel;
    tilhørendeFaktaType?: TypeVilkårFaktaFlytting | null;
}

interface RegelInfo {
    erHovedregel: boolean;
    reglerSomMåNullstilles: RegelIdFlytting[];
    svaralternativer: SvaralternativFlytting[];
}

export type RegelstrukturFlytting = Record<RegelIdFlytting, RegelInfo>;
