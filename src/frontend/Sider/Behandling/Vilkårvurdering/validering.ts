import { Begrunnelse, BegrunnelseRegel, Regler, Svaralternativ } from '../../../typer/regel';
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

            const valgtSvaralternativ = regler[gjeldendeRegelId]?.svarMapping[vurdering.svar!];

            if (begrunnelseErPåkrevdOgMangler(valgtSvaralternativ, vurdering.begrunnelse)) {
                valideringsfeil[gjeldendeRegelId] = 'Begrunnelse er obligatorisk for dette valget';
            }
        });
    });

    return valideringsfeil;
};

function begrunnelseErPåkrevdOgMangler(
    svarsalternativ: Svaralternativ,
    begrunnelse: Begrunnelse
): boolean {
    if (svarsalternativ.begrunnelseType === BegrunnelseRegel.PÅKREVD) {
        return manglerBegrunnelse(begrunnelse);
    }
    return false;
}

const manglerBegrunnelse = (begrunnelse: string | undefined | null): boolean => {
    return !begrunnelse || begrunnelse.trim().length === 0;
};
