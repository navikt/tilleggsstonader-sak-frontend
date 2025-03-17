import { EndreMålgruppeGenerellForm } from './EndreMålgruppeGenerell';
import { EndreMålgruppeLæremidlerForm } from './EndreMålgruppeLæremidler';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';
import { Målgruppe, MålgruppeType } from '../typer/vilkårperiode/målgruppe';

export interface MålgruppeValidering extends Periode {
    type: MålgruppeType | '';
    begrunnelse?: string;
}

export const validerMålgruppe = (
    endretMålgruppe: EndreMålgruppeGenerellForm | EndreMålgruppeLæremidlerForm,
    begrunnelsePåkrevd: boolean,
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

    if (begrunnelsePåkrevd && harIkkeVerdi(endretMålgruppe.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};
