import { delvilkårSomSkalVises } from './utils';
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
    delvilkårSomSkalVises(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => ({
        regel: regelId,
        svar: delvilkårsvurdering.svar,
        begrunnelse: delvilkårsvurdering.begrunnelse,
    }));

export const oppdaterVilkårsvurderinger = (
    vilkårsvurdering: Vilkårsvurdering,
    nyeSvar: VurderingInput,
    nyeBegrunnelser: VurderingInput
): Vilkårsvurdering => {
    return Object.fromEntries(
        Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
            regelId,
            {
                ...delvilkårsvurdering,
                ...{ svar: nyeSvar[regelId] },
                ...{ begrunnelse: nyeBegrunnelser[regelId] },
            },
        ])
    );
};
