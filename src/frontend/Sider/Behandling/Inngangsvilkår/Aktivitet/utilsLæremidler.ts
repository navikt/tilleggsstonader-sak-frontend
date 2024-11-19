import { EndreAktivitetFormLæremidler } from './EndreAktivitetLæremidler';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånedTreMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { AktivitetType, DelvilkårAktivitetLæremidler } from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitetLæremidler = (
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormLæremidler =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(behandlingId, aktivitetFraRegister)
        : nyTomAktivitet(behandlingId);

function nyAktivitetFraRegister(
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormLæremidler {
    return {
        behandlingId: behandlingId,
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        faktaOgVurderinger: {
            '@type': 'AKTIVITET',
            fakta: { prosent: aktivitetFraRegister.prosentDeltakelse },
            vurderinger: {},
        },
        begrunnelse: lagBegrunnelseForAktivitet(aktivitetFraRegister),
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(behandlingId: string): EndreAktivitetFormLæremidler {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        faktaOgVurderinger: {
            '@type': 'AKTIVITET',
            fakta: { prosent: undefined },
            vurderinger: {},
        },
    };
}

const lagBegrunnelseForAktivitet = (aktivitetFraRegister: Registeraktivitet) =>
    `Aktivitet: ${aktivitetFraRegister.typeNavn}\nStatus: ${aktivitetFraRegister.status}`;

export const skalVurdereHarUtgifter = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitetLæremidler = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormLæremidler,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormLæremidler => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        faktaOgVurderinger: {
            ...eksisterendeAktivitetForm.faktaOgVurderinger,
            vurderinger: { harUtgifter: undefined },
        },
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetFormLæremidler,
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

export const finnBegrunnelseGrunnerAktivitetLæremidler = (
    type: AktivitetType | '',
    delvilkår: DelvilkårAktivitetLæremidler
) => {
    const delvilkårSomMåBegrunnes = [];

    if (delvilkår.harUtgifter?.svar === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.LØNNET); // TODO: fiks at den ikke bruker lønnet
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};
