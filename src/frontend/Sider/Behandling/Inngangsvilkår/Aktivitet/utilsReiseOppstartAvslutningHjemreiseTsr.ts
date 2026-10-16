import { EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr } from './EndreAktivitetReiseOppstartAvslutningHjemreiseTsr';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetReiseOppstartAvslutningHjemreiseTsr,
    AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar,
} from '../typer/vilkårperiode/aktivitetReiseOppstartAvslutningHjemreise';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetReiseOppstartAvslutningHjemreiseTsr
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr => ({
    ...eksisterendeAktivitet,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr {
    return {
        type: AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr {
    return {
        type: '',
        fom: '',
        tom: '',
    };
}

export const erTiltak = (type: AktivitetType | '') => type === AktivitetType.TILTAK;
export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[
                    Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR
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

export const finnBegrunnelseGrunnerAktivitet = (type: AktivitetType | '') => {
    const delvilkårSomMåBegrunnes = [];

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};

export const faktaOgSvarRequest: AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar = {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR',
};
