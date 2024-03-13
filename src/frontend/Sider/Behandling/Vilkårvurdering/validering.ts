import { BegrunnelseRegel, RegelId } from '../../../typer/regel';
import { Vilkårsvurderinger } from '../vilkår';

export type Feilmeldinger = Record<RegelId, string | undefined>;

export const validerVilkårsvurderinger = (
    vilkårsvurderinger: Vilkårsvurderinger
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = {};

    Object.entries(vilkårsvurderinger).forEach(([regel, delvilkårsvurdering]) => {
        const gjeldendeSvar = delvilkårsvurdering.svar;

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
