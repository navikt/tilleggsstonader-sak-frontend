import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';

export interface EndreVilkårsperiode extends Periode {
    type: AktivitetType | MålgruppeType | '';
    aktivitetsdager?: number;
}

export const validerVilkårsperiode = (
    endretVilkårsperiode: EndreVilkårsperiode
): FormErrors<EndreVilkårsperiode> => {
    const feil: FormErrors<EndreVilkårsperiode> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        aktivitetsdager: undefined,
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

    return feil;
};

const aktivitetsdagerErGyldigTall = (aktivitetsdager: number | undefined): boolean =>
    harTallverdi(aktivitetsdager) && aktivitetsdager >= 1 && aktivitetsdager <= 5;
