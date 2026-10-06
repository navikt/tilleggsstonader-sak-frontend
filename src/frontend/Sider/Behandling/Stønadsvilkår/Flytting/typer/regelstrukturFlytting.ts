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

export type RegelstrukturFlytting = Record<
    RegelIdFlytting,
    {
        erHovedregel: boolean;
        reglerSomMåNullstilles: RegelIdFlytting[];
        svaralternativer: SvaralternativFlytting[];
    }
>;
