import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { finnBegrunnelseGrunnerMålgruppe } from './utils';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';
import { Målgruppe, MålgruppeType } from '../typer/målgruppe';

export interface MålgruppeValidering extends Periode {
    type: MålgruppeType | '';
    begrunnelse?: string;
}

export const validerMålgruppe = (
    endretMålgruppe: EndreMålgruppeForm,
    lagretMålgruppe?: Målgruppe | undefined,
    revurderesFraDato?: string
): FormErrors<MålgruppeValidering> => {
    const feil: FormErrors<MålgruppeValidering> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        begrunnelse: undefined,
    };

    if (endretMålgruppe.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    const periodeValidering = validerPeriode(endretMålgruppe, lagretMålgruppe, revurderesFraDato);

    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerMålgruppe(
        endretMålgruppe.type,
        endretMålgruppe.delvilkår
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretMålgruppe.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};
