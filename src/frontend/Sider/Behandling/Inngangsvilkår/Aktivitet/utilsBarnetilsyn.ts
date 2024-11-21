import { EndreAktivitetFormBarnetilsyn } from './EndreAktivitetBarnetilsyn';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånedTreMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { AktivitetBarnetilsyn, AktivitetType } from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormBarnetilsyn =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetBarnetilsyn
): EndreAktivitetFormBarnetilsyn => ({
    ...eksisterendeAktivitet,
    svarLønnet: eksisterendeAktivitet.delvilkår.lønnet?.svar,
});

/**
 * Prefyller aktivtetsdager med 5 dager hvis det gjelder utdanning då feltet mangler fra arena
 * Ellers brukes antallDagerPerUke
 */
const aktivitetsdagerFraRegister = (aktivitetFraRegister: Registeraktivitet) =>
    aktivitetFraRegister.erUtdanning ? 5 : aktivitetFraRegister.antallDagerPerUke;

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormBarnetilsyn {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        aktivitetsdager: aktivitetsdagerFraRegister(aktivitetFraRegister),
        svarLønnet: undefined,
        begrunnelse: lagBegrunnelseForAktivitet(aktivitetFraRegister),
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(): EndreAktivitetFormBarnetilsyn {
    return {
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
        svarLønnet: undefined,
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

export interface FaktaOgVurderingerAktivitetBarnetilsyn {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    svarLønnet: SvarJaNei | undefined;
}

export interface LagreAktivitetBarnetilsyn {
    behandlingId: string;
    type: AktivitetType | '';
    faktaOgVurderinger: FaktaOgVurderingerAktivitetBarnetilsyn;
    begrunnelse?: string;
    kildeId?: string;
}

export const mapTilDto = (
    aktivitetForm: EndreAktivitetFormBarnetilsyn,
    behandlingId: string
): LagreAktivitetBarnetilsyn => ({
    behandlingId: behandlingId,
    type: aktivitetForm.type,
    faktaOgVurderinger: {
        '@type': 'AKTIVITET_BARNETILSYN',
        aktivitetsdager: aktivitetForm.aktivitetsdager,
        svarLønnet: aktivitetForm.svarLønnet,
    },
    begrunnelse: aktivitetForm.begrunnelse,
    kildeId: aktivitetForm.kildeId,
});
