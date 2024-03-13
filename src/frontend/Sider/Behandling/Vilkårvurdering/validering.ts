import { BegrunnelseRegel, RegelId } from '../../../typer/regel';
import { Vilkårsvurdering } from '../vilkår';

export type Feilmeldinger = Record<RegelId, string | undefined>;

export const validerVilkårsvurdering = (vilkårsvurdering: Vilkårsvurdering): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = {};

    Object.entries(vilkårsvurdering).forEach(([regel, delvilkårsvurdering]) => {
        const gjeldendeSvar = delvilkårsvurdering.svar;
        const erAvhengig = delvilkårsvurdering.følgerFraAnnenRegel;

        if (erAvhengig) {
            // Hvis en regel er avhengig av svaret på en annen regel, og dette svaret IKKE er valgt, så trenger vi ikke
            // validere denne underregelen noe mer.
            const { avhengigRegel, avhengigSvar } = erAvhengig;
            if (vilkårsvurdering[avhengigRegel].svar !== avhengigSvar) {
                return;
            }
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
