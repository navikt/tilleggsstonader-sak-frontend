import {
    EndreAktivitetFormLæremidler,
    VurderingerAktivitetLæremidler,
} from './EndreAktivitetLæremidler';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { ingenMålgruppeAktivitetAntallMndBakITiden } from '../../Felles/grunnlagAntallMndBakITiden';
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

export const erUtdanningEllerTiltak = (type: AktivitetType | '') =>
    type === AktivitetType.UTDANNING || type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetTypeLæremidler,
    eksisterendeAktivitetForm: EndreAktivitetFormLæremidler,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormLæremidler => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    const utdanningEllerTiltak = erUtdanningEllerTiltak(nyType);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        studienivå: utdanningEllerTiltak ? eksisterendeAktivitetForm.studienivå : undefined,
        prosent: utdanningEllerTiltak ? eksisterendeAktivitetForm.prosent : undefined,
        vurderinger: {
            svarHarUtgifter: erUtdanningEllerTiltak(nyType)
                ? eksisterendeAktivitetForm.vurderinger.svarHarUtgifter
                : undefined,
            svarHarRettTilUtstyrsstipend: utdanningEllerTiltak
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
        return {
            fom: førsteDagIMånederForut(
                ingenMålgruppeAktivitetAntallMndBakITiden[Stønadstype.LÆREMIDLER],
                søknadMottattTidspunkt
            ),
            tom: dagensDato(),
        };
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
