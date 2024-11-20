import { EndreAktivitetFormBarnetilsyn } from './EndreAktivitetBarnetilsyn';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånedTreMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { AktivitetBarnetilsyn, AktivitetType } from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormBarnetilsyn =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(behandlingId, aktivitetFraRegister)
        : nyTomAktivitet(behandlingId);

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetBarnetilsyn,
    behandlingId: string
): EndreAktivitetFormBarnetilsyn => ({
    ...eksisterendeAktivitet,
    behandlingId: behandlingId,
    svarLønnet: eksisterendeAktivitet.delvilkår.lønnet?.svar,
});

/**
 * Prefyller aktivtetsdager med 5 dager hvis det gjelder utdanning då feltet mangler fra arena
 * Ellers brukes antallDagerPerUke
 */
const aktivitetsdagerFraRegister = (aktivitetFraRegister: Registeraktivitet) =>
    aktivitetFraRegister.erUtdanning ? 5 : aktivitetFraRegister.antallDagerPerUke;

function nyAktivitetFraRegister(
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormBarnetilsyn {
    return {
        behandlingId: behandlingId,
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        aktivitetsdager: aktivitetsdagerFraRegister(aktivitetFraRegister),
        begrunnelse: lagBegrunnelseForAktivitet(aktivitetFraRegister),
        svarLønnet: undefined,
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(behandlingId: string): EndreAktivitetFormBarnetilsyn {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        aktivitetsdager: undefined,
        svarLønnet: undefined,
    };
}

const lagBegrunnelseForAktivitet = (aktivitetFraRegister: Registeraktivitet) =>
    `Aktivitet: ${aktivitetFraRegister.typeNavn}\nStatus: ${aktivitetFraRegister.status}`;

export const skalVurdereLønnet = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormBarnetilsyn,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormBarnetilsyn => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        aktivitetsdager: resetAktivitetsdager(nyType, eksisterendeAktivitetForm),
        svarLønnet: resetSvarLønnet(nyType, eksisterendeAktivitetForm.svarLønnet),
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetFormBarnetilsyn,
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

const resetAktivitetsdager = (
    nyType: AktivitetType,
    eksisterendeForm: EndreAktivitetFormBarnetilsyn
) => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return undefined;
    } else if (!harTallverdi(eksisterendeForm.aktivitetsdager)) {
        return 5;
    }

    return eksisterendeForm.aktivitetsdager;
};

const resetSvarLønnet = (
    type: AktivitetType,
    eksisterendeSvarLønnet: SvarJaNei | undefined
): SvarJaNei | undefined => (skalVurdereLønnet(type) ? eksisterendeSvarLønnet : undefined);

export const finnTingSomMåBegrunnes = (
    type: AktivitetType | '',
    svarLønnet: SvarJaNei | undefined
) => {
    const tingSomMåBegrunnes = [];

    if (svarLønnet === SvarJaNei.JA) {
        tingSomMåBegrunnes.push(BegrunnelseGrunner.LØNNET);
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        tingSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return tingSomMåBegrunnes;
};
