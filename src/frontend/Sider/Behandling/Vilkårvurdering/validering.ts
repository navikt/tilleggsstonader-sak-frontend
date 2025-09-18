import { BegrunnelseRegel, Regel, RegelId, Regler } from '../../../typer/regel';
import { validerPeriode } from '../../../utils/periode';
import { harTallverdi } from '../../../utils/tall';
import { harIkkeVerdi } from '../../../utils/utils';
import { Delvilkår, OffentligTransport } from '../vilkår';

export type Feilmeldinger = {
    delvilkårsvurderinger: Record<RegelId, string | undefined>;
    fom?: string;
    tom?: string;
    reisedagerPerUke?: string;
    billettpriser?: string;
};

export const ingenFeil: Feilmeldinger = { delvilkårsvurderinger: {} };

export function ingen(valideringsfeil: Feilmeldinger) {
    return JSON.stringify(valideringsfeil) === JSON.stringify(ingenFeil);
}

export const validerVilkårsvurderinger = (
    delvilkårsett: Delvilkår[],
    regler: Regler,
    fom: string | undefined,
    tom: string | undefined,
    erFremtidigUtgift: boolean | undefined,
    offentligTransport?: OffentligTransport
): Feilmeldinger => {
    const valideringsfeil: Feilmeldinger = { delvilkårsvurderinger: {} };

    const periodeValidering = validerPeriode({ fom: fom || '', tom: tom || '' });
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

    if (offentligTransport) {
        if (!harTallverdi(offentligTransport.reisedagerPerUke)) {
            valideringsfeil.reisedagerPerUke = 'Må fylles ut';
        }

        if (
            !harTallverdi(offentligTransport.prisEnkelbillett) &&
            !harTallverdi(offentligTransport.prisSyvdagersbillett) &&
            !harTallverdi(offentligTransport.prisTrettidagersbillett)
        ) {
            valideringsfeil.billettpriser = 'Minst en billettpris må fylles ut';
        }
    }

    return valideringsfeil;
};

const begrunnelseKreves = (svar: string, regel: Regel): boolean => {
    const valgtSvaralternativ = regel?.svarMapping[svar];

    return valgtSvaralternativ?.begrunnelseType === BegrunnelseRegel.PÅKREVD;
};
