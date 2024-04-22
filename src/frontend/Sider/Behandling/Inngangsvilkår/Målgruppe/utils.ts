import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { EndreAktivitetForm } from '../Aktivitet/EndreAktivitetRad';
import {
    DelvilkårMålgruppe,
    FaktiskMålgruppe,
    MålgruppeType,
    MålgruppeTypeTilFaktiskMålgruppe,
} from '../typer/målgruppe';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/EndreVilkårperiode/utils';

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

export const skalVurdereDekkesAvAnnetRegelverk = (type: MålgruppeType) =>
    målgruppeErNedsattArbeidsevne(type);

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
    dekketAvAnnetRegelverk: skalVurdereDekkesAvAnnetRegelverk(type)
        ? dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler(delvilkår)
        : undefined,
});

export const finnBegrunnelseGrunnerMålgruppe = (
    type: MålgruppeType | '',
    delvilkår: DelvilkårMålgruppe
) => {
    const delvilkårSomMåBegrunnes = [];

    if (type === MålgruppeType.NEDSATT_ARBEIDSEVNE) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.NEDSATT_ARBEIDSEVNE);
    }

    if (type !== '' && målgrupperHvorMedlemskapMåVurderes.includes(type)) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.MEDLEMSKAP);
    }

    if (delvilkår.dekketAvAnnetRegelverk?.svar === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.DEKKET_AV_ANNET_REGELVERK);
    }

    return delvilkårSomMåBegrunnes;
};

export const harObligatoriskBegrunnelse = (målgruppeForm: EndreMålgruppeForm) => {
    const begrunnelseGrunner = finnBegrunnelseGrunnerMålgruppe(
        målgruppeForm.type,
        målgruppeForm.delvilkår
    );
    return begrunnelseGrunner.length > 0;
};

export const erFormForMålgruppe = (
    vilkårperiode: EndreMålgruppeForm | EndreAktivitetForm
): vilkårperiode is EndreMålgruppeForm => {
    return (
        (Object.keys(MålgruppeType).includes(vilkårperiode.type) || vilkårperiode.type === '') &&
        vilkårperiode.delvilkår['@type'] === 'MÅLGRUPPE'
    );
};
