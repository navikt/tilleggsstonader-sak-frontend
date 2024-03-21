import { delvilkårSomErRelevante } from './utils';
import { RegelId, VurderingInput, SvarId, Vilkårsvurdering } from '../vilkår';

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
    delvilkårSomErRelevante(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => ({
        regel: regelId,
        svar: delvilkårsvurdering.svar,
        begrunnelse: delvilkårsvurdering.begrunnelse,
    }));

export const oppdaterVilkårsvurderinger = (
    vilkårsvurdering: Vilkårsvurdering,
    nyVurdering: VurderingInput
): Vilkårsvurdering => {
    return Object.fromEntries(
        Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
            regelId,
            {
                ...delvilkårsvurdering,
                ...{ svar: nyVurdering[regelId].svar },
                ...{ begrunnelse: nyVurdering[regelId].begrunnelse },
            },
        ])
    );
};

export const mapTilVurderingInput = (vilkårsvurdering: Vilkårsvurdering): VurderingInput => {
    return Object.fromEntries(
        Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
            regelId,
            { svar: delvilkårsvurdering.svar, begrunnelse: delvilkårsvurdering?.begrunnelse },
        ])
    );
};
