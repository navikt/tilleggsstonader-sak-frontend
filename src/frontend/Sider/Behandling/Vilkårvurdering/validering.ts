import { BegrunnelseRegel, Regel, RegelId, Regler } from '../../../typer/regel';
import { Vurdering } from '../vilkår';

export type Feilmeldinger = Record<RegelId, string | undefined>;

export const validerVilkårsvurderinger = (
    vurderinger: Vurdering[],
    regler: Regler
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = {};

    vurderinger.forEach((vurdering) => {
        const gjeldendeRegel = vurdering.regelId;

        if (!vurdering.svar) {
            valideringsfeil[gjeldendeRegel] = 'Du må ta et valg';
            return;
        }

        if (
            begrunnelseKreves(vurdering.svar, regler[gjeldendeRegel]) &&
            manglerInnhold(vurdering.begrunnelse)
        ) {
            valideringsfeil[gjeldendeRegel] = 'Begrunnelse er obligatorisk for dette valget';
            return;
        }
    });

    return valideringsfeil;
};

const begrunnelseKreves = (svar: string, regel: Regel): boolean => {
    const valgtSvaralternativ = regel?.svarMapping[svar];

    return valgtSvaralternativ?.begrunnelseType === BegrunnelseRegel.PÅKREVD;
};

const manglerInnhold = (str: string | undefined | null): boolean => {
    return !str || str.trim() === '';
};
