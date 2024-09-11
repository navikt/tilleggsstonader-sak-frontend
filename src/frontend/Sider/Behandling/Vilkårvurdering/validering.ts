import { BegrunnelseRegel, Regel, RegelId, Regler } from '../../../typer/regel';
import { erDatoEtterEllerLik } from '../../../utils/dato';
import { harIkkeVerdi } from '../../../utils/utils';
import { Delvilkår } from '../vilkår';

export type Feilmeldinger = {
    delvilkårsvurderinger: Record<RegelId, string | undefined>;
    fom?: string;
    tom?: string;
};

export const ingenFeil = { delvilkårsvurderinger: {} };

export function ingen(valideringsfeil: Feilmeldinger) {
    return JSON.stringify(valideringsfeil) === JSON.stringify(ingenFeil);
}

export const validerVilkårsvurderinger = (
    delvilkårsett: Delvilkår[],
    regler: Regler,
    fom?: string,
    tom?: string
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = { delvilkårsvurderinger: {} };

    if (harIkkeVerdi(fom)) {
        valideringsfeil.fom = 'Må angis';
    }
    if (harIkkeVerdi(tom)) {
        valideringsfeil.tom = 'Må angis';
    }
    if (fomErEtterTom(fom, tom)) {
        valideringsfeil.tom = 'Må være etter fra-datoen';
    }

    delvilkårsett
        .flatMap((delvilkår) => delvilkår.vurderinger)
        .forEach((vurdering) => {
            const gjeldendeRegel = vurdering.regelId;

            if (!vurdering.svar) {
                valideringsfeil.delvilkårsvurderinger[gjeldendeRegel] = 'Du må ta et valg';
                return;
            }

            if (
                begrunnelseKreves(vurdering.svar, regler[gjeldendeRegel]) &&
                harIkkeVerdi(vurdering.begrunnelse)
            ) {
                valideringsfeil.delvilkårsvurderinger[gjeldendeRegel] =
                    'Begrunnelse er obligatorisk for dette valget';
                return;
            }
        });

    return valideringsfeil;
};

const fomErEtterTom = (fom?: string, tom?: string) => fom && tom && !erDatoEtterEllerLik(fom, tom);

const begrunnelseKreves = (svar: string, regel: Regel): boolean => {
    const valgtSvaralternativ = regel?.svarMapping[svar];

    return valgtSvaralternativ?.begrunnelseType === BegrunnelseRegel.PÅKREVD;
};
