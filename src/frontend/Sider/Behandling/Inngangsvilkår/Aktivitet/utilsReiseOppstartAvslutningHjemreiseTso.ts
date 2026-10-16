import { EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso } from './EndreAktivitetReiseOppstartAvslutningHjemreiseTso';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetReiseOppstartAvslutningHjemreiseTso,
    AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar,
} from '../typer/vilkårperiode/aktivitetReiseOppstartAvslutningHjemreise';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetReiseOppstartAvslutningHjemreiseTso
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso => ({
    ...eksisterendeAktivitet,
    svarLønnet: eksisterendeAktivitet.faktaOgVurderinger.lønnet?.svar,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        svarLønnet: undefined,
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso {
    return {
        type: '',
        fom: '',
        tom: '',
        svarLønnet: undefined,
    };
}

export const erTiltak = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const erUtdanningEllerTiltak = (type: AktivitetType | '') =>
    type === AktivitetType.UTDANNING || type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        svarLønnet: undefined,
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[
                    Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO
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
    svarLønnet: SvarJaNei | undefined
) => {
    const delvilkårSomMåBegrunnes = [];

    if (svarLønnet === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.LØNNET);
    }

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};

export const mapFaktaOgSvarTilRequest = (
    aktivitetForm: EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso
): AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar => ({
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO',
    svarLønnet: aktivitetForm.svarLønnet,
});
