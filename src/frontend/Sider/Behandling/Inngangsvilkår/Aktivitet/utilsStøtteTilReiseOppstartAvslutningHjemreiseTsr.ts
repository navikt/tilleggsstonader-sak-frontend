import { EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr } from './EndreAktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsr';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsr,
    AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar,
} from '../typer/vilkårperiode/aktivitetStøtteTilReiseOppstartAvslutningHjemreise';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsr
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr => ({
    ...eksisterendeAktivitet,
    svarLønnet: eksisterendeAktivitet.faktaOgVurderinger.lønnet?.svar,
    svarHarUtgifter: eksisterendeAktivitet.faktaOgVurderinger.harUtgifter?.svar,
    svarErAktivitetenObligatorisk:
        eksisterendeAktivitet.faktaOgVurderinger.erAktivitetenObligatorisk?.svar,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr {
    return {
        type: AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        kildeId: aktivitetFraRegister.id,
        svarErAktivitetenObligatorisk: undefined,
    };
}

function nyTomAktivitet(): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr {
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

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr => {
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
    eksisterendeForm: EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[
                    Stønadstype.STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR
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
    aktivitetForm: EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTsr
): AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar => ({
    '@type': 'AKTIVITET_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR',
    svarLønnet: aktivitetForm.svarLønnet,
    svarHarUtgifter: aktivitetForm.svarHarUtgifter,
    svarErAktivitetenObligatorisk: aktivitetForm.svarErAktivitetenObligatorisk,
});
