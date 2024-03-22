import { Delvilkår, RegelId, Delvilkårsett } from '../vilkår';

export const finnAvhengighetTilOverordnetValg = (
    vilkårsvurdering: Delvilkårsett,
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

export const delvilkårSomErRelevante = (delvilkårsett: Delvilkårsett): [string, Delvilkår][] =>
    Object.entries(delvilkårsett).filter(([regelId]) => {
        const { følgerAvOverordnetValg, overordnetValgErOppfylt } =
            finnAvhengighetTilOverordnetValg(delvilkårsett, regelId);

        return !følgerAvOverordnetValg && overordnetValgErOppfylt;
    });
