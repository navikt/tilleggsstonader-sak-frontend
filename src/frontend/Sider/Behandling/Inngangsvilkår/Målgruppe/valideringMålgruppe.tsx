import { EndreMålgruppeForm } from './EndreMålgruppe';
import { finnBegrunnelseGrunnerMålgruppe, skalVurdereLønnetForMålgruppe } from './utils';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { formaterIsoPeriode, perioderOverlapper } from '../../../../utils/dato';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';
import { Målgruppe, MålgruppeType } from '../typer/vilkårperiode/målgruppe';

export interface MålgruppeValidering extends Periode {
    type: MålgruppeType | '';
    begrunnelse?: string;
    svarLønnet?: string;
}

export const validerMålgruppe = (
    endretMålgruppe: EndreMålgruppeForm,
    lagretMålgruppe: Målgruppe | undefined,
    lagredeMålgrupper: Målgruppe[],
    stønadstype: Stønadstype
): FormErrors<MålgruppeValidering> => {
    const feil: FormErrors<MålgruppeValidering> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        begrunnelse: undefined,
        svarLønnet: undefined,
    };

    if (endretMålgruppe.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    const periodeValidering = validerPeriode(endretMålgruppe);

    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }

    const overlappendeMålgruppe = lagredeMålgrupper
        .filter((målgruppe) => målgruppe.status !== 'SLETTET')
        .filter((målgruppe) => målgruppe.id !== lagretMålgruppe?.id)
        .filter((målgruppe) => målgruppe.type === endretMålgruppe.type)
        .find((målgruppe) => perioderOverlapper(målgruppe, endretMålgruppe));
    if (overlappendeMålgruppe) {
        return {
            ...feil,
            fom: `Periode overlapper med ${formaterIsoPeriode(overlappendeMålgruppe.fom, overlappendeMålgruppe.tom)}`,
        };
    }

    if (
        skalVurdereLønnetForMålgruppe(endretMålgruppe.type, stønadstype) &&
        endretMålgruppe.vurderinger.svarLønnet === undefined
    ) {
        return { ...feil, svarLønnet: 'Du må svare på om bruker mottar ordinær lønn i tiltaket' };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerMålgruppe(
        endretMålgruppe.type,
        endretMålgruppe.vurderinger
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretMålgruppe.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};
