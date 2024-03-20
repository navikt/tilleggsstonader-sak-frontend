import { Delvilkårsvurdering, RegelId, Vilkårsvurdering } from '../vilkår';

export const finnAvhengighetTilOverordnetValg = (
    vilkårsvurdering: Vilkårsvurdering,
    regelenSomSkalSjekkes: RegelId
): { følgerAvOverordnetValg: boolean; overordnetValgErOppfylt: boolean | undefined } => {
    const følgerFraOverordnetValg = vilkårsvurdering[regelenSomSkalSjekkes].følgerFraOverordnetValg;

    if (følgerFraOverordnetValg === null) {
        return {
            følgerAvOverordnetValg: false,
            overordnetValgErOppfylt: undefined,
        };
    }

    const { regel, svar } = følgerFraOverordnetValg;

    return {
        følgerAvOverordnetValg: true,
        overordnetValgErOppfylt: vilkårsvurdering[regel].svar === svar,
    };
};

export const vurderingerSomSkalVises = (
    vilkårsvurdering: Vilkårsvurdering
): [string, Delvilkårsvurdering][] =>
    Object.entries(vilkårsvurdering).filter(([regelId]) => {
        const { følgerAvOverordnetValg, overordnetValgErOppfylt } =
            finnAvhengighetTilOverordnetValg(vilkårsvurdering, regelId);

        return !(følgerAvOverordnetValg && !overordnetValgErOppfylt);
    });
