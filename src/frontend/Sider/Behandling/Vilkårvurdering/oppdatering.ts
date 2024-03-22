import { delvilkårSomErRelevante } from './utils';
import { RegelId, VurderingInput, SvarId, Delvilkårsett, Delvilkår } from '../vilkår';

export type SvarPåVilkår = {
    id: string;
    behandlingId: string;
    vurdering: OppdaterDelvilkårvurdering[];
};

interface OppdaterDelvilkårvurdering {
    regel: RegelId;
    svar: SvarId | null;
    begrunnelse: string | null;
}

const kanHaBegrunnelse = (delvilkårsvurdering: Delvilkår): boolean =>
    delvilkårsvurdering.svar != null &&
    delvilkårsvurdering.svaralternativer[delvilkårsvurdering.svar].begrunnelsestype !== 'UTEN';

export const mapTilOppdaterDelvilkårsvurderinger = (
    vilkårsvurdering: Delvilkårsett
): OppdaterDelvilkårvurdering[] =>
    delvilkårSomErRelevante(vilkårsvurdering).map(([regelId, delvilkår]) => ({
        regel: regelId,
        svar: delvilkår.svar,
        begrunnelse: kanHaBegrunnelse(delvilkår) ? delvilkår.begrunnelse : null,
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
                svar: nyVurdering[regelId].svar,
                begrunnelse: nyVurdering[regelId].begrunnelse,
            },
        ])
    );
};

export const mapTilVurderingInput = (delvilkårsett: Delvilkårsett): VurderingInput => {
    return Object.fromEntries(
        Object.entries(delvilkårsett).map(([regelId, delvilkår]) => [
            regelId,
            { svar: delvilkår.svar, begrunnelse: delvilkår?.begrunnelse },
        ])
    );
};
