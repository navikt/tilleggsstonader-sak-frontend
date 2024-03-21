import { delvilkårSomErRelevante } from './utils';
import { RegelId, VurderingInput, SvarId, Delvilkårsett, Delvilkår } from '../vilkår';

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

const skalHaBegrunnelse = (delvilkårsvurdering: Delvilkår): boolean =>
    delvilkårsvurdering.svar != null &&
    delvilkårsvurdering.svaralternativer[delvilkårsvurdering.svar].begrunnelsestype !== 'UTEN';

export const mapTilOppdaterDelvilkårsvurderinger = (
    vilkårsvurdering: Delvilkårsett
): OppdaterDelvilkårvurdering[] =>
    delvilkårSomErRelevante(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => ({
        regel: regelId,
        svar: delvilkårsvurdering.svar,
        begrunnelse: skalHaBegrunnelse(delvilkårsvurdering)
            ? delvilkårsvurdering.begrunnelse
            : null,
    }));

export const oppdaterVurderinger = (
    delvilkårsett: Delvilkårsett,
    nyVurdering: VurderingInput
): Delvilkårsett => {
    return Object.fromEntries(
        Object.entries(delvilkårsett).map(([regelId, delvilkår]) => [
            regelId,
            {
                ...delvilkår,
                ...{ svar: nyVurdering[regelId].svar },
                ...{ begrunnelse: nyVurdering[regelId].begrunnelse },
            },
        ])
    );
};

export const mapTilVurderingInput = (vilkårsvurdering: Delvilkårsett): VurderingInput => {
    return Object.fromEntries(
        Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => [
            regelId,
            { svar: delvilkårsvurdering.svar, begrunnelse: delvilkårsvurdering?.begrunnelse },
        ])
    );
};
