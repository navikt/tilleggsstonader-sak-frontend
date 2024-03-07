import { BegrunnelseRegel, Regel, Regler } from '../../../typer/regel';
import { Delvilkår } from '../vilkår';

export type Feilmeldinger = {
    [regelId: string]: string | undefined;
};

export const validerVilkårsvurderinger = (
    delvilkårsett: Delvilkår[],
    regler: Regler
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = {};

    delvilkårsett
        .flatMap((delvilkår) => delvilkår.vurderinger)
        .forEach((vurdering) => {
            const gjeldendeRegel = vurdering.regelId;

            if (!vurdering.svar) {
                valideringsfeil[gjeldendeRegel] = 'Du må ta et valg';
                return;
            }

            if (
                begrunnelseKreves(vurdering.svar, regler[gjeldendeRegel]) &&
                erUtenInnhold(vurdering.begrunnelse)
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

const erUtenInnhold = (str: string | undefined | null): boolean => {
    return !str || str.trim() === '';
};
