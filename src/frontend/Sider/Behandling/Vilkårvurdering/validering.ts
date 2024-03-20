import { finnAvhengighetTilOverordnetValg } from './utils';
import { manglerInnhold } from '../../../typer/typeUtils';
import { RegelId, Vilkårsvurdering } from '../vilkår';

export type Feilmeldinger = Record<RegelId, string | undefined>;

export const validerVilkårsvurdering = (vilkårsvurdering: Vilkårsvurdering): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = {};

    Object.entries(vilkårsvurdering).forEach(([regel, delvilkårsvurdering]) => {
        const gjeldendeSvar = delvilkårsvurdering.svar;

        const { følgerAvOverordnetValg, overordnetValgErOppfylt } =
            finnAvhengighetTilOverordnetValg(vilkårsvurdering, regel);

        if (følgerAvOverordnetValg && !overordnetValgErOppfylt) {
            return;
        }

        if (!gjeldendeSvar) {
            valideringsfeil[regel] = 'Du må ta et valg';
            return;
        }

        const kreverBegrunnelse =
            delvilkårsvurdering.svaralternativer[gjeldendeSvar].begrunnelsestype === 'PÅKREVD';

        if (kreverBegrunnelse && manglerInnhold(delvilkårsvurdering.begrunnelse)) {
            valideringsfeil[regel] = 'Begrunnelse er obligatorisk for dette valget';
            return;
        }
    });

    return valideringsfeil;
};
