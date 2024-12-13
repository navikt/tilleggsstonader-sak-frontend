import {
    EndreAktivitetFormLæremidler,
    VurderingerAktivitetLæremidler,
} from './EndreAktivitetLæremidler';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånedTreMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetLæremidler,
    AktivitetLæremidlerFaktaOgSvar,
    AktivitetTypeLæremidler,
} from '../typer/vilkårperiode/aktivitetLæremidler';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormLæremidler =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(aktivitetFraRegister) // TODO: Fiks senere
        : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetLæremidler
): EndreAktivitetFormLæremidler => ({
    ...eksisterendeAktivitet,
    prosent: eksisterendeAktivitet.faktaOgVurderinger.prosent,
    studienivå: eksisterendeAktivitet.faktaOgVurderinger.studienivå,
    vurderinger: {
        svarHarUtgifter: eksisterendeAktivitet.faktaOgVurderinger.harUtgifter?.svar,
        svarHarRettTilUtstyrsstipend:
            eksisterendeAktivitet.faktaOgVurderinger.harRettTilUtstyrsstipend?.svar,
    },
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormLæremidler {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        prosent: aktivitetFraRegister.prosentDeltakelse,
        studienivå: undefined,
        begrunnelse: lagBegrunnelseForAktivitet(aktivitetFraRegister),
        vurderinger: {
            svarHarUtgifter: undefined,
            svarHarRettTilUtstyrsstipend: undefined,
        },
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(): EndreAktivitetFormLæremidler {
    return {
        type: '',
        fom: '',
        tom: '',
        prosent: undefined,
        studienivå: undefined,
        vurderinger: {
            svarHarUtgifter: undefined,
            svarHarRettTilUtstyrsstipend: undefined,
        },
    };
}

const lagBegrunnelseForAktivitet = (aktivitetFraRegister: Registeraktivitet) =>
    `Aktivitet: ${aktivitetFraRegister.typeNavn}\nStatus: ${aktivitetFraRegister.status}`;

export const erUtdanningEllerTiltak = (type: AktivitetType | '') =>
    type === AktivitetType.UTDANNING || type === AktivitetType.TILTAK;

export const skalVurdereHarUtgifter = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetTypeLæremidler,
    eksisterendeAktivitetForm: EndreAktivitetFormLæremidler,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormLæremidler => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    const erUtdanningEllerTiltak =
        nyType === AktivitetType.TILTAK || nyType === AktivitetType.UTDANNING;

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        studienivå: erUtdanningEllerTiltak ? eksisterendeAktivitetForm.studienivå : undefined,
        prosent: erUtdanningEllerTiltak ? eksisterendeAktivitetForm.prosent : undefined,
        vurderinger: {
            svarHarUtgifter: skalVurdereHarUtgifter(nyType)
                ? eksisterendeAktivitetForm.vurderinger.svarHarUtgifter
                : undefined,
            svarHarRettTilUtstyrsstipend: erUtdanningEllerTiltak
                ? eksisterendeAktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend
                : undefined,
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
    vurderinger: VurderingerAktivitetLæremidler
) => {
    const delvilkårSomMåBegrunnes = [];

    if (vurderinger.svarHarUtgifter === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.HAR_UTGIFTER);
    }

    if (vurderinger.svarHarRettTilUtstyrsstipend === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.HAR_RETT_TIL_UTSTYRSSTIPEND);
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
    studienivå: aktivitetForm.studienivå,
    svarHarUtgifter: aktivitetForm.vurderinger.svarHarUtgifter,
    svarHarRettTilUtstyrsstipend: aktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend,
});
