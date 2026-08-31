import { EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso } from './EndreAktivitetStøtteTilReiseOppstartAvslutningHjemreiseTso';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTso,
    AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar,
} from '../typer/vilkårperiode/aktivitetStøtteTilReiseOppstartAvslutningHjemreise';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTso
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso => ({
    ...eksisterendeAktivitet,
    svarLønnet: eksisterendeAktivitet.faktaOgVurderinger.lønnet?.svar,
    svarHarUtgifter: eksisterendeAktivitet.faktaOgVurderinger.harUtgifter?.svar,
    svarErAktivitetenObligatorisk:
        eksisterendeAktivitet.faktaOgVurderinger.erAktivitetenObligatorisk?.svar,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        kildeId: aktivitetFraRegister.id,
        svarErAktivitetenObligatorisk: undefined,
    };
}

function nyTomAktivitet(): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso {
    return {
        type: '',
        fom: '',
        tom: '',
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        svarErAktivitetenObligatorisk: undefined,
    };
}

export const erTiltak = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const erUtdanningEllerTiltak = (type: AktivitetType | '') =>
    type === AktivitetType.UTDANNING || type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso => {
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
    eksisterendeForm: EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[
                    Stønadstype.STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO
                ],
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
    svarHarUtgifter: SvarJaNei | undefined,
    svarErAktivitetenObligatorisk: SvarJaNei | undefined
) => {
    const delvilkårSomMåBegrunnes = [];

    if (svarLønnet === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.LØNNET);
    }

    if (svarHarUtgifter === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.HAR_UTGIFTER);
    }

    if (svarErAktivitetenObligatorisk === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.AKTIVITETEN_ER_OBLIGATORISK);
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};

export const mapFaktaOgSvarTilRequest = (
    aktivitetForm: EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso
): AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar => ({
    '@type': 'AKTIVITET_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO',
    svarLønnet: aktivitetForm.svarLønnet,
    svarHarUtgifter: aktivitetForm.svarHarUtgifter,
    svarErAktivitetenObligatorisk: aktivitetForm.svarErAktivitetenObligatorisk,
});
