import { TypeVilkårFaktaFlytting } from './faktaFlytting';
import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export enum RegelIdFlytting {
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
