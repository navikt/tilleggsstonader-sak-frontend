import { EndreAktivitetFormDagligReiseTso } from './EndreAktivitetDagligReiseTso';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetDagligReiseTso,
    AktivitetDagligReiseTsoFaktaOgSvar,
} from '../typer/vilkårperiode/aktivitetDagligReiseTso';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormDagligReiseTso =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetDagligReiseTso
): EndreAktivitetFormDagligReiseTso => ({
    ...eksisterendeAktivitet,
    svarLønnet: eksisterendeAktivitet.faktaOgVurderinger.lønnet?.svar,
    svarHarUtgifter: eksisterendeAktivitet.faktaOgVurderinger.harUtgifter?.svar,
    aktivitetsdager: eksisterendeAktivitet.faktaOgVurderinger.aktivitetsdager,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormDagligReiseTso {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        kildeId: aktivitetFraRegister.id,
        aktivitetsdager: aktivitetFraRegister.antallDagerPerUke,
    };
}

function nyTomAktivitet(): EndreAktivitetFormDagligReiseTso {
    return {
        type: '',
        fom: '',
        tom: '',
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        aktivitetsdager: undefined,
    };
}

export const skalVurdereLønnet = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const erUtdanningEllerTiltak = (type: AktivitetType | '') =>
    type === AktivitetType.UTDANNING || type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormDagligReiseTso,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormDagligReiseTso => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetFormDagligReiseTso,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[Stønadstype.DAGLIG_REISE_TSO],
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
    svarLønnet: SvarJaNei | undefined,
    svarHarUtgifter: SvarJaNei | undefined
) => {
    const delvilkårSomMåBegrunnes = [];

    if (svarLønnet === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.LØNNET);
    }

    if (svarHarUtgifter === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.HAR_UTGIFTER);
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};

export const mapFaktaOgSvarTilRequest = (
    aktivitetForm: EndreAktivitetFormDagligReiseTso
): AktivitetDagligReiseTsoFaktaOgSvar => ({
    '@type': 'AKTIVITET_DAGLIG_REISE_TSO',
    svarLønnet: aktivitetForm.svarLønnet,
    svarHarUtgifter: aktivitetForm.svarHarUtgifter,
    aktivitetsdager: aktivitetForm.aktivitetsdager,
});
