import { finnBegrunnelseGrunner } from './EndreVilkårperiode/utils';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi } from '../../../../utils/utils';
import { EndreAktivitetForm } from '../Aktivitet/EndreAktivitetRad';
import { erFormForAktivitet } from '../Aktivitet/utils';
import { EndreMålgruppeForm } from '../Målgruppe/EndreMålgruppeRad';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';

export interface EndreVilkårsperiode extends Periode {
    type: AktivitetType | MålgruppeType | '';
    aktivitetsdager?: number;
    begrunnelse?: string;
}

export const validerVilkårsperiode = (
    endretVilkårsperiode: EndreMålgruppeForm | EndreAktivitetForm
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
        erFormForAktivitet(endretVilkårsperiode) &&
        endretVilkårsperiode.type !== AktivitetType.INGEN_AKTIVITET &&
        !aktivitetsdagerErGyldigTall(endretVilkårsperiode.aktivitetsdager)
    ) {
        return { ...feil, aktivitetsdager: 'Aktivitetsdager må være et tall mellom 1 og 5' };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunner(endretVilkårsperiode);

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretVilkårsperiode.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};

const aktivitetsdagerErGyldigTall = (aktivitetsdager: number | undefined): boolean =>
    harTallverdi(aktivitetsdager) && aktivitetsdager >= 1 && aktivitetsdager <= 5;
