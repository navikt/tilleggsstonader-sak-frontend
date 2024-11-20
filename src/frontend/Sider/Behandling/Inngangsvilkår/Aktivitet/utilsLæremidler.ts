import { EndreAktivitetFormLæremidler } from './EndreAktivitetLæremidler';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånedTreMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { AktivitetType, DelvilkårAktivitetLæremidler } from '../typer/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    behandlingId: string,
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormLæremidler =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(behandlingId, aktivitetFraRegister) // TODO: Fiks senere
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
        prosent: aktivitetFraRegister.prosentDeltakelse,
        begrunnelse: lagBegrunnelseForAktivitet(aktivitetFraRegister),
        delvilkår: { '@type': 'AKTIVITET' },
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(behandlingId: string): EndreAktivitetFormLæremidler {
    return {
        behandlingId: behandlingId,
        type: '',
        fom: '',
        tom: '',
        delvilkår: { '@type': 'AKTIVITET' },
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
        delvilkår: {
            ...eksisterendeAktivitetForm.delvilkår,
            harUtgifter:
                nyType === AktivitetType.TILTAK
                    ? eksisterendeAktivitetForm.delvilkår.harUtgifter
                    : undefined, // TODO: Er denne resettingen nødvendig? Eller kan man alltid returnere undefined
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

export const finnBegrunnelseGrunnerAktivitet = (
    type: AktivitetType | '',
    delvilkår: DelvilkårAktivitetLæremidler
) => {
    const delvilkårSomMåBegrunnes = [];

    if (delvilkår.harUtgifter?.svar === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.HAR_UTGIFTER);
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};
