import { RegelId, SvarId, Vilkårsvurdering } from '../vilkår';

export type OppdaterVilkårsvurdering = {
    id: string;
    behandlingId: string;
    vurdering: OppdaterDelvilkårvurdering[];
};

interface OppdaterDelvilkårvurdering {
    regel: RegelId;
    svar: SvarId | null;
    begrunnelse: string | null;
}

export const mapTilOppdaterDelvilkårsvurderinger = (
    vilkårsvurdering: Vilkårsvurdering
): OppdaterDelvilkårvurdering[] =>
    Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => ({
        regel: regelId,
        svar: delvilkårsvurdering.svar,
        begrunnelse: delvilkårsvurdering.begrunnelse,
    }));
