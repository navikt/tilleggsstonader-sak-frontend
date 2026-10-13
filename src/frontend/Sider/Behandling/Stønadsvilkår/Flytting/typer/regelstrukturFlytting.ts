import { TypeVilkårFaktaFlytting } from './faktaFlytting';
import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export enum RegelIdFlytting {
    HVILKEN_FORBINDELSE_FLYTTER_BRUKER = 'HVILKEN_FORBINDELSE_FLYTTER_BRUKER',
    MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET = 'MÅ_FLYTTE_FOR_Å_GJENNOMFØRE_AKTIVITET',
    SAMMENHENG_FLYTTING_OG_ARBEID = 'SAMMENHENG_FLYTTING_OG_ARBEID',
    FLYTTER_PGA_OPPSTART_ARBEID = 'FLYTTER_PGA_OPPSTART_ARBEID',
    ER_KOSTNADER_TIL_FLYTTING_NØDVENDIGE = 'ER_KOSTNADER_TIL_FLYTTING_NØDVENDIGE',
    HVORDAN_SKAL_BRUKER_FLYTTE = 'HVORDAN_SKAL_BRUKER_FLYTTE',
}

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
