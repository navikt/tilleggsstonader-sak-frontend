import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import {
    DelvilkårMålgruppe,
    FaktiskMålgruppe,
    MålgruppeType,
    MålgruppeTypeTilFaktiskMålgruppe,
} from '../typer/målgruppe';
import { SvarJaNei } from '../typer/vilkårperiode';

export type MålgrupperMedMedlemskapsvurdering =
    | MålgruppeType.NEDSATT_ARBEIDSEVNE
    | MålgruppeType.OMSTILLINGSSTØNAD;

export const nyMålgruppe = (behandlingId: string): EndreMålgruppeForm => {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        delvilkår: { '@type': 'MÅLGRUPPE' },
    };
};

export const målgrupperHvorMedlemskapMåVurderes = [
    MålgruppeType.NEDSATT_ARBEIDSEVNE,
    MålgruppeType.UFØRETRYGD,
    MålgruppeType.OMSTILLINGSSTØNAD,
];

export const målgruppeErNedsattArbeidsevne = (målgruppeType: MålgruppeType) => {
    return MålgruppeTypeTilFaktiskMålgruppe[målgruppeType] === FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE;
};

const dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler = (delvilkår: DelvilkårMålgruppe) =>
    delvilkår.dekketAvAnnetRegelverk || { svar: SvarJaNei.NEI };

export const resetDelvilkår = (
    type: MålgruppeType,
    delvilkår: DelvilkårMålgruppe
): DelvilkårMålgruppe => ({
    ...delvilkår,
    medlemskap: målgrupperHvorMedlemskapMåVurderes.includes(type)
        ? delvilkår.medlemskap
        : undefined,
    dekketAvAnnetRegelverk: målgruppeErNedsattArbeidsevne(type)
        ? dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler(delvilkår)
        : undefined,
});
