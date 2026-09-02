import { EndreAktivitetFormReiseTilSamlingTsr } from './EndreAktivitetReiseTilSamlingTsr';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Kodeverk } from '../../../../typer/kodeverk';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetReiseTilSamlingTsr,
    AktivitetReiseTilSamlingTsrFaktaOgSvar,
} from '../typer/vilkårperiode/aktivitetReiseTilSamlingTsr';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormReiseTilSamlingTsr =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetReiseTilSamlingTsr
): EndreAktivitetFormReiseTilSamlingTsr => ({
    ...eksisterendeAktivitet,
    svarLønnet: eksisterendeAktivitet.faktaOgVurderinger.lønnet?.svar,
    svarHarUtgifter: eksisterendeAktivitet.faktaOgVurderinger.harUtgifter?.svar,
    svarErAktivitetenObligatorisk:
        eksisterendeAktivitet.faktaOgVurderinger.erAktivitetenObligatorisk?.svar,
    aktivitetsdager: eksisterendeAktivitet.faktaOgVurderinger.aktivitetsdager,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormReiseTilSamlingTsr {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        tiltaksvariant: tiltaksvariantForRegisterAktivitet(aktivitetFraRegister),
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        svarErAktivitetenObligatorisk: undefined,
        aktivitetsdager: aktivitetFraRegister.antallDagerPerUke,
        kildeId: aktivitetFraRegister.id,
    };
}

/**
 * Aktiviteter fra Arena har alltid en tiltaksvariant (type/typeNavn). Denne kan brukes direkte som
 * tiltaksvariant på aktiviteten, selv om varianten ikke finnes i det reduserte utvalget som vises i
 * dropdownen for manuelt tillagte aktiviteter (`tiltaksvariantValg`). En tiltaksvariant som ikke er
 * mappet til en utbetalingstype vil kunne føre til avslag, men skal fortsatt kunne velges.
 */
function tiltaksvariantForRegisterAktivitet(registerAktivitet: Registeraktivitet): Kodeverk {
    return { kode: registerAktivitet.type, beskrivelse: registerAktivitet.typeNavn };
}

export function finnTiltaksvariantForKode(kode: string, tiltaksvariantValg: Kodeverk[]) {
    return tiltaksvariantValg.find((valg) => valg.kode === kode);
}

function nyTomAktivitet(): EndreAktivitetFormReiseTilSamlingTsr {
    return {
        type: '',
        tiltaksvariant: undefined,
        fom: '',
        tom: '',
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        svarErAktivitetenObligatorisk: undefined,
        aktivitetsdager: undefined,
    };
}

export const erTiltak = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const erUtdanningEllerTiltak = (type: AktivitetType | '') =>
    type === AktivitetType.UTDANNING || type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormReiseTilSamlingTsr,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormReiseTilSamlingTsr => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom,
        tom,
        svarLønnet: undefined,
        svarHarUtgifter: undefined,
        svarErAktivitetenObligatorisk: undefined,
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetFormReiseTilSamlingTsr,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[Stønadstype.REISE_TIL_SAMLING_TSR],
                søknadMottattTidspunkt
            ),
            tom: dagensDato(),
        };
    }

    if (eksisterendeForm.type === AktivitetType.INGEN_AKTIVITET) {
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
    aktivitetForm: EndreAktivitetFormReiseTilSamlingTsr
): AktivitetReiseTilSamlingTsrFaktaOgSvar => ({
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSR',
    svarLønnet: aktivitetForm.svarLønnet,
    svarHarUtgifter: aktivitetForm.svarHarUtgifter,
    svarErAktivitetenObligatorisk: aktivitetForm.svarErAktivitetenObligatorisk,
    aktivitetsdager: aktivitetForm.aktivitetsdager,
});
