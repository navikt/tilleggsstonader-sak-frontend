import { EndreAktivitetForm } from './EndreAktivitetRad';
import { dagensDato, treMånederTilbake } from '../../../../utils/dato';
import { harTallverdi } from '../../../../utils/tall';
import { EndreMålgruppeForm } from '../Målgruppe/EndreMålgruppeRad';
import { AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/EndreVilkårperiode/utils';

export const nyAktivitet = (behandlingId: string): EndreAktivitetForm => {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        aktivitetsdager: undefined,
        delvilkår: { '@type': 'AKTIVITET' },
    };
};

export const skalVurdereLønnet = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetForm
): EndreAktivitetForm => ({
    ...eksisterendeAktivitetForm,
    type: nyType,
    fom: resetFom(nyType, eksisterendeAktivitetForm),
    tom: resetTom(nyType, eksisterendeAktivitetForm),
    aktivitetsdager: resetAktivitetsdager(nyType, eksisterendeAktivitetForm),
    delvilkår: resetDelvilkår(nyType, eksisterendeAktivitetForm.delvilkår),
});

const resetFom = (type: AktivitetType, eksisterendeForm: EndreAktivitetForm) => {
    if (type === AktivitetType.INGEN_AKTIVITET) {
        return treMånederTilbake();
    }

    return resetEllerBeholdDato(eksisterendeForm.type, eksisterendeForm.fom);
};

const resetTom = (type: AktivitetType, eksisterendeForm: EndreAktivitetForm) => {
    if (type === AktivitetType.INGEN_AKTIVITET) {
        return dagensDato();
    }

    return resetEllerBeholdDato(eksisterendeForm.type, eksisterendeForm.tom);
};

const resetEllerBeholdDato = (forrigeType: AktivitetType | '', forrigeDato: string) => {
    if (forrigeType === AktivitetType.INGEN_AKTIVITET) {
        return '';
    }

    return forrigeDato;
};

const resetAktivitetsdager = (nyType: AktivitetType, eksisterendeForm: EndreAktivitetForm) => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return undefined;
    } else if (!harTallverdi(eksisterendeForm.aktivitetsdager)) {
        return 5;
    }

    return eksisterendeForm.aktivitetsdager;
};

const resetDelvilkår = (
    type: AktivitetType,
    delvilkår: DelvilkårAktivitet
): DelvilkårAktivitet => ({
    ...delvilkår,
    lønnet: skalVurdereLønnet(type) ? delvilkår.lønnet : undefined,
});

export const finnBegrunnelseGrunnerAktivitet = (
    type: AktivitetType | '',
    delvilkår: DelvilkårAktivitet
) => {
    const delvilkårSomMåBegrunnes = [];

    if (delvilkår.lønnet?.svar === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.NEDSATT_ARBEIDSEVNE);
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};

export const erFormForAktivitet = (
    vilkårperiode: EndreMålgruppeForm | EndreAktivitetForm
): vilkårperiode is EndreAktivitetForm => {
    return (
        (Object.keys(AktivitetType).includes(vilkårperiode.type) || vilkårperiode.type === '') &&
        vilkårperiode.delvilkår['@type'] === 'AKTIVITET'
    );
};
