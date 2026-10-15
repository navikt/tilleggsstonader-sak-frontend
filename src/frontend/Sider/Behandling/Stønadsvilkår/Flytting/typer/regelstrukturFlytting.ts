import { TypeVilkårFaktaFlytting } from './faktaFlytting';
import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export enum RegelIdFlytting {
    HVILKEN_FORBINDELSE_FLYTTER_BRUKER = 'HVILKEN_FORBINDELSE_FLYTTER_BRUKER',
    MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET = 'MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET',
    FLYTTER_IFBM_ARBEID_ETTER_AKTIVITET = 'FLYTTER_IFBM_ARBEID_ETTER_AKTIVITET',
    MÅ_FLYTTE_FOR_Å_STARTE_I_ARBEID = 'MÅ_FLYTTE_FOR_Å_STARTE_I_ARBEID',
    ER_KOSTNADER_TIL_FLYTTING_NØDVENDIGE = 'ER_KOSTNADER_TIL_FLYTTING_NØDVENDIGE',
    HVORDAN_SKAL_BRUKER_FLYTTE = 'HVORDAN_SKAL_BRUKER_FLYTTE',
}

export const begrunnelseHjelpeteksterForFlytteforbindelse: Partial<Record<SvarId, string>> = {
    FLYTTING_VED_START_AV_AKTIVITET: 'Beskriv aktiviteten.',
    FLYTTING_VED_AVSLUTTET_AKTIVITET: 'Beskriv aktiviteten.',
    ARBEID_ETTER_GJENNOMFØRT_AKTIVITET: 'Beskriv aktiviteten.',
    ENSLIG_FORSØRGER_ELLER_GJENLEVENDE_STARTER_I_ARBEID:
        'Dette alternativet gjelder bare for enslig forsørger eller gjenlevende. Det er ikke et krav at personen har gjennomført aktivitet.',
};

export const delvilkårHjelpetekster: Partial<Record<RegelIdFlytting, string>> = {
    [RegelIdFlytting.FLYTTER_IFBM_ARBEID_ETTER_AKTIVITET]:
        'Med aktivitet menes arbeidsrettet tiltak (hvis nedsatt arbeidsevne) eller godkjent utdanning (hvis gjenlevende eller enslig mor eller far)',
    [RegelIdFlytting.MÅ_FLYTTE_FOR_Å_STARTE_I_ARBEID]:
        'Det må være nødvendig å flytte fra hjemstedet for å kunne starte i arbeidet på det nye stedet.',
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
