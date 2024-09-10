import { BegrunnelseRegel, Regel, RegelId, Regler } from '../../../typer/regel';
import { erDatoEtterEllerLik } from '../../../utils/dato';
import { harIkkeVerdi } from '../../../utils/utils';
import { Delvilkår } from '../vilkår';

export type Feilmeldinger = {
    vilkårsvurdering: Record<RegelId, string | undefined>;
    fom?: string;
    tom?: string;
};

export const ingenFeil = { vilkårsvurdering: {} };

export const validerVilkårsvurderinger = (
    periodiserteVilkårIsEnabled: boolean,
    delvilkårsett: Delvilkår[],
    regler: Regler,
    fom?: string,
    tom?: string
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = { vilkårsvurdering: {} };

    if (periodiserteVilkårIsEnabled) {
        if (harIkkeVerdi(fom)) {
            valideringsfeil.fom = 'Må angis';
        }
        if (harIkkeVerdi(tom)) {
            valideringsfeil.tom = 'Må angis';
        }
        if (fomErEtterTom(fom, tom)) {
            valideringsfeil.tom = 'Må være etter fra-datoen';
        }
    }

    delvilkårsett
        .flatMap((delvilkår) => delvilkår.vurderinger)
        .forEach((vurdering) => {
            const gjeldendeRegel = vurdering.regelId;

            if (!vurdering.svar) {
                valideringsfeil.vilkårsvurdering[gjeldendeRegel] = 'Du må ta et valg';
                return;
            }

            if (
                begrunnelseKreves(vurdering.svar, regler[gjeldendeRegel]) &&
                harIkkeVerdi(vurdering.begrunnelse)
            ) {
                valideringsfeil.vilkårsvurdering[gjeldendeRegel] =
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
