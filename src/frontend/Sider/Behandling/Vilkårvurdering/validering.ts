import { BegrunnelseRegel, Regel, Regler } from '../../../typer/regel';
import { Delvilkår } from '../vilkår';

export type Feilmeldinger = {
    [regelId: string]: string;
};

export const validerVilkårsvurderinger = (
    delvilkårsett: Delvilkår[],
    regler: Regler
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = {};

    delvilkårsett.map((delvilkår) => {
        delvilkår.vurderinger.map((vurdering) => {
            const gjeldendeRegelId = vurdering.regelId;

            if (!vurdering.svar) {
                valideringsfeil[gjeldendeRegelId] = 'Du må ta et valg';
                return;
            }

            if (
                begrunnelseKreves(vurdering.svar, regler[gjeldendeRegelId]) &&
                erUtenInnhold(vurdering.begrunnelse)
            ) {
                valideringsfeil[gjeldendeRegelId] = 'Begrunnelse er obligatorisk for dette valget';
                return;
            }
        });
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
