import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';

export interface EndreVilkårsperiode extends Periode {
    type: AktivitetType | MålgruppeType | '';
}

export const validerVilkårsperiode = (
    endretVilkårsperiode: EndreVilkårsperiode
): FormErrors<EndreVilkårsperiode> => {
    const feil: FormErrors<EndreVilkårsperiode> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
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
    return feil;
};
