import { BegrunnelseRegel, Regel, RegelId, Regler } from '../../../typer/regel';
import { validerPeriode } from '../../../utils/periode';
import { harIkkeVerdi } from '../../../utils/utils';
import { Delvilkår, RedigerbareVilkårfelter } from '../vilkår';

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
    lagredeFelter: RedigerbareVilkårfelter,
    regler: Regler,
    fom?: string,
    tom?: string,
    revurderesFraDato?: string,
    erFremtidigUtgift?: boolean
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = { delvilkårsvurderinger: {} };

    const periodeValidering = validerPeriode(
        { fom: fom || '', tom: tom || '' },
        { fom: lagredeFelter.fom || '', tom: lagredeFelter.tom || '' },
        revurderesFraDato
    );
    if (periodeValidering) {
        return {
            ...valideringsfeil,
            ...periodeValidering,
        };
    }

    if (!erFremtidigUtgift) {
        delvilkårsett
            .flatMap((delvilkår) => delvilkår.vurderinger)
            .forEach((vurdering) => {
                const gjeldendeRegel = vurdering.regelId;

                // I MVPen krever vi at svarer på "Har søker høyere utgifter grunnet helsemessige årsaker?" er "Nei" da vi ikke har støtte for å beregne dette
                if (
                    gjeldendeRegel === 'HØYERE_UTGIFTER_HELSEMESSIG_ÅRSAKER' &&
                    vurdering.svar === 'JA'
                ) {
                    valideringsfeil.delvilkårsvurderinger[gjeldendeRegel] =
                        'Løsningen støtter ikke dette valget enda. Ta kontakt med Tilleggsstønader-teamet.';
                    return;
                }

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
    }

    return valideringsfeil;
};

const begrunnelseKreves = (svar: string, regel: Regel): boolean => {
    const valgtSvaralternativ = regel?.svarMapping[svar];

    return valgtSvaralternativ?.begrunnelseType === BegrunnelseRegel.PÅKREVD;
};
