import { vurderAvhengighetTilOverordnetValg } from './utils';
import { BegrunnelseRegel, RegelId } from '../../../typer/regel';
import { Vilkårsvurdering } from '../vilkår';

export type Feilmeldinger = Record<RegelId, string | undefined>;

export const validerVilkårsvurdering = (vilkårsvurdering: Vilkårsvurdering): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = {};

    Object.entries(vilkårsvurdering).forEach(([regel, delvilkårsvurdering]) => {
        const gjeldendeSvar = delvilkårsvurdering.svar;

        const { erAvhengig, avhengighetErOppfylt } = vurderAvhengighetTilOverordnetValg(
            vilkårsvurdering,
            regel
        );

        if (erAvhengig && !avhengighetErOppfylt) {
            return;
        }

        if (!gjeldendeSvar) {
            valideringsfeil[regel] = 'Du må ta et valg';
            return;
        }

        const kreverBegrunnelse =
            delvilkårsvurdering.svaralternativer[gjeldendeSvar].begrunnelsesType ===
            BegrunnelseRegel.PÅKREVD;

        if (kreverBegrunnelse && manglerInnhold(delvilkårsvurdering.begrunnelse)) {
            valideringsfeil[regel] = 'Begrunnelse er obligatorisk for dette valget';
            return;
        }
    });

    return valideringsfeil;
};

const manglerInnhold = (str: string | undefined | null): boolean => {
    return !str || str.trim() === '';
};
