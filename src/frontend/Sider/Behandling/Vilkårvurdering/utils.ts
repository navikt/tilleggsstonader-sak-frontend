import { Vilkårsvurdering } from '../vilkår';

export const vurderAvhengighetTilOverordnetValg = (
    vilkårsvurdering: Vilkårsvurdering,
    regelenSomSkalSjekkes: string
): { erAvhengig: boolean; avhengighetErOppfylt: boolean | undefined } => {
    const følgerFraOverordnetValg = vilkårsvurdering[regelenSomSkalSjekkes].følgerFraOverordnetValg;

    const erAvhengig = følgerFraOverordnetValg != null;

    if (!erAvhengig) {
        return { avhengighetErOppfylt: undefined, erAvhengig };
    }

    const { regel, svar } = følgerFraOverordnetValg;

    const avhengighetErOppfylt = vilkårsvurdering[regel].svar === svar;

    return { erAvhengig, avhengighetErOppfylt };
};
