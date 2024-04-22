import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi } from '../../../../utils/utils';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';

export interface EndreVilkårsperiode extends Periode {
    type: AktivitetType | MålgruppeType | '';
    aktivitetsdager?: number;
    begrunnelse?: string;
}

export const validerVilkårsperiode = (
    endretVilkårsperiode: EndreVilkårsperiode,
    erBegrunnelseObligatorisk: boolean
): FormErrors<EndreVilkårsperiode> => {
    const feil: FormErrors<EndreVilkårsperiode> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        aktivitetsdager: undefined,
        begrunnelse: undefined,
    };

    if (endretVilkårsperiode.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    const periodeValidering = validerPeriode(endretVilkårsperiode);

    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }

    if (
        endretVilkårsperiode.type in AktivitetType &&
        !aktivitetsdagerErGyldigTall(endretVilkårsperiode.aktivitetsdager)
    ) {
        return { ...feil, aktivitetsdager: 'Aktivitetsdager må være et tall mellom 1 og 5' };
    }

    if (erBegrunnelseObligatorisk && harIkkeVerdi(endretVilkårsperiode.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};

const aktivitetsdagerErGyldigTall = (aktivitetsdager: number | undefined): boolean =>
    harTallverdi(aktivitetsdager) && aktivitetsdager >= 1 && aktivitetsdager <= 5;
