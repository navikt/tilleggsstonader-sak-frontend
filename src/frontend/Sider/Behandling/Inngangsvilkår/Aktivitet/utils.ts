import { EndreAktivitetForm } from './EndreAktivitetRad';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånedTreMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { EndreMålgruppeForm } from '../Målgruppe/EndreMålgruppeRad';
import { AktivitetType, DelvilkårAktivitet } from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/EndreVilkårperiode/utils';

export const nyAktivitet = (
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetForm =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(behandlingId, aktivitetFraRegister)
        : nyTomAktivitet(behandlingId);

function nyAktivitetFraRegister(
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetForm {
    return {
        behandlingId: behandlingId,
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        aktivitetsdager: aktivitetFraRegister.antallDagerPerUke,
        begrunnelse: lagBegrunnelseForAktivitet(aktivitetFraRegister),
        delvilkår: { '@type': 'AKTIVITET' },
    };
}

function nyTomAktivitet(behandlingId: string): EndreAktivitetForm {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        aktivitetsdager: undefined,
        delvilkår: { '@type': 'AKTIVITET' },
    };
}

const lagBegrunnelseForAktivitet = (aktivitetFraRegister: Registeraktivitet) =>
    `Aktivitet: ${aktivitetFraRegister.typeNavn}\nStatus: ${aktivitetFraRegister.status}`;

export const skalVurdereLønnet = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetForm,
    søknadMottattTidspunkt?: string
): EndreAktivitetForm => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        aktivitetsdager: resetAktivitetsdager(nyType, eksisterendeAktivitetForm),
        delvilkår: resetDelvilkår(nyType, eksisterendeAktivitetForm.delvilkår),
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetForm,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return { fom: førsteDagIMånedTreMånederForut(søknadMottattTidspunkt), tom: dagensDato() };
    }

    if (eksisterendeForm.type === AktivitetType.INGEN_AKTIVITET) {
        // Resetter datoer om de forrige var satt automatisk
        return { fom: '', tom: '' };
    }

    return { fom: eksisterendeForm.fom, tom: eksisterendeForm.tom };
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
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.LØNNET);
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
