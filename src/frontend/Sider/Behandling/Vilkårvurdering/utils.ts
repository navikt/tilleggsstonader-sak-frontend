import { Vilkårsvurdering } from '../vilkår';

export const vurderAvhengighetTilOverordnetValg = (
    vilkårsvurdering: Vilkårsvurdering,
    regelenSomSkalSjekkes: string
): { følgerAvOverordnetValg: boolean; valgetErOppfylt: boolean | undefined } => {
    const følgerFraOverordnetValg = vilkårsvurdering[regelenSomSkalSjekkes].følgerFraOverordnetValg;

    const følgerAvOverordnetValg = følgerFraOverordnetValg != null;

    if (!følgerAvOverordnetValg) {
        return { valgetErOppfylt: undefined, følgerAvOverordnetValg };
    }

    const { regel, svar } = følgerFraOverordnetValg;

    const valgetErOppfylt = vilkårsvurdering[regel].svar === svar;

    return { følgerAvOverordnetValg, valgetErOppfylt };
};
