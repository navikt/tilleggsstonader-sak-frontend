import { EndreAktivitetFormLæremidler } from './EndreAktivitetLæremidler';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånedTreMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import {
    AktivitetLæremidler,
    AktivitetType,
    AktivitetLæremidlerFaktaOgSvar,
} from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormLæremidler =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(aktivitetFraRegister) // TODO: Fiks senere
        : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetLæremidler
): EndreAktivitetFormLæremidler => ({
    ...eksisterendeAktivitet,
    svarHarUtgifter: eksisterendeAktivitet.delvilkår.harUtgifter?.svar,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormLæremidler {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        prosent: aktivitetFraRegister.prosentDeltakelse,
        begrunnelse: lagBegrunnelseForAktivitet(aktivitetFraRegister),
        svarHarUtgifter: undefined,
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(): EndreAktivitetFormLæremidler {
    return {
        type: '',
        fom: '',
        tom: '',
        svarHarUtgifter: undefined,
        prosent: undefined,
    };
}

const lagBegrunnelseForAktivitet = (aktivitetFraRegister: Registeraktivitet) =>
    `Aktivitet: ${aktivitetFraRegister.typeNavn}\nStatus: ${aktivitetFraRegister.status}`;

export const skalVurdereHarUtgifter = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitet = (
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
        prosent: undefined, //todo: finn ut om den skal resettes
        svarHarUtgifter: undefined,
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

export const finnBegrunnelseGrunnerAktivitet = (
    type: AktivitetType | '',
    svarHarUtgifter: SvarJaNei | undefined
) => {
    const delvilkårSomMåBegrunnes = [];

    if (svarHarUtgifter === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.HAR_UTGIFTER);
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};

export const mapFaktaOgSvarTilRequest = (
    aktivitetForm: EndreAktivitetFormLæremidler
): AktivitetLæremidlerFaktaOgSvar => ({
    '@type': 'AKTIVITET_LÆREMIDLER',
    prosent: aktivitetForm.prosent,
    svarHarUtgifter: aktivitetForm.svarHarUtgifter,
});
