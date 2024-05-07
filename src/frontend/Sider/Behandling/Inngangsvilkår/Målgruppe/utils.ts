import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { dagensDato, treMånederTilbake } from '../../../../utils/dato';
import { EndreAktivitetForm } from '../Aktivitet/EndreAktivitetRad';
import { Aktivitet } from '../typer/aktivitet';
import {
    DelvilkårMålgruppe,
    FaktiskMålgruppe,
    Målgruppe,
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

export const resettMålgruppe = (
    nyType: MålgruppeType,
    eksisterendeForm: EndreMålgruppeForm
): EndreMålgruppeForm => ({
    ...eksisterendeForm,
    type: nyType,
    fom: resetFom(nyType, eksisterendeForm),
    tom: resetTom(nyType, eksisterendeForm),
    delvilkår: resetDelvilkår(nyType, eksisterendeForm.delvilkår),
});

const resetFom = (type: MålgruppeType, eksisterendeForm: EndreMålgruppeForm) => {
    if (type === MålgruppeType.INGEN_MÅLGRUPPE) {
        return treMånederTilbake();
    }

    return resetEllerBeholdDato(eksisterendeForm.type, eksisterendeForm.fom);
};

const resetTom = (type: MålgruppeType, eksisterendeForm: EndreMålgruppeForm) => {
    if (type === MålgruppeType.INGEN_MÅLGRUPPE) {
        return dagensDato();
    }

    return resetEllerBeholdDato(eksisterendeForm.type, eksisterendeForm.tom);
};

const resetEllerBeholdDato = (forrigeType: MålgruppeType | '', forrigeDato: string) => {
    if (forrigeType === MålgruppeType.INGEN_MÅLGRUPPE) {
        return '';
    }

    return forrigeDato;
};

const resetDelvilkår = (
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

const dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler = (delvilkår: DelvilkårMålgruppe) =>
    delvilkår.dekketAvAnnetRegelverk || { svar: SvarJaNei.NEI };

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

    if (type === MålgruppeType.INGEN_MÅLGRUPPE) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_MÅLGRUPPE);
    }

    if (delvilkår.dekketAvAnnetRegelverk?.svar === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.DEKKET_AV_ANNET_REGELVERK);
    }

    return delvilkårSomMåBegrunnes;
};

export const erFormForMålgruppe = (
    vilkårperiode: EndreMålgruppeForm | EndreAktivitetForm
): vilkårperiode is EndreMålgruppeForm => {
    return (
        (vilkårperiode.type in MålgruppeType || vilkårperiode.type === '') &&
        vilkårperiode.delvilkår['@type'] === 'MÅLGRUPPE'
    );
};

export const erMålgruppe = (vilkårperiode: Målgruppe | Aktivitet): vilkårperiode is Målgruppe => {
    return vilkårperiode.type in MålgruppeType;
};
