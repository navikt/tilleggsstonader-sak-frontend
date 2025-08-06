import { EndreAktivitetFormDagligReiseTsr } from './EndreAktivitetDagligReiseTsr';
import { finnBegrunnelseGrunnerAktivitet } from './utilsDagligReiseTsr';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';
import { Aktivitet, AktivitetType } from '../typer/vilkårperiode/aktivitet';

export interface AktivitetValidering extends Periode {
    type: AktivitetType | '';
    begrunnelse?: string;
}

export const validerAktivitet = (
    endretAktivitet: EndreAktivitetFormDagligReiseTsr,
    lagretAktivitet?: Aktivitet | undefined,
    revurderesFraDato?: string
): FormErrors<AktivitetValidering> => {
    const feil: FormErrors<AktivitetValidering> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        begrunnelse: undefined,
    };

    if (endretAktivitet.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    const periodeValidering = validerPeriode(endretAktivitet, lagretAktivitet, revurderesFraDato);

    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerAktivitet(endretAktivitet.type);

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretAktivitet.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};
