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
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined,
    tiltaksvariantValg: Kodeverk[]
): EndreAktivitetFormReiseTilSamlingTsr =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(aktivitetFraRegister, tiltaksvariantValg)
        : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetReiseTilSamlingTsr
): EndreAktivitetFormReiseTilSamlingTsr => ({
    ...eksisterendeAktivitet,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet,
    tiltaksvariantValg: Kodeverk[]
): EndreAktivitetFormReiseTilSamlingTsr {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        tiltaksvariant: finnTiltaksvariantForRegisterAktivitet(
            aktivitetFraRegister,
            tiltaksvariantValg
        ),
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        kildeId: aktivitetFraRegister.id,
    };
}

function finnTiltaksvariantForRegisterAktivitet(
    registerAktivitet: Registeraktivitet,
    tiltaksvariantValg: Kodeverk[]
) {
    return tiltaksvariantValg.find((valg) => valg.beskrivelse === registerAktivitet.typeNavn);
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

export const finnBegrunnelseGrunnerAktivitet = (type: AktivitetType | '') => {
    const delvilkårSomMåBegrunnes = [];

    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }

    return delvilkårSomMåBegrunnes;
};

export const faktaOgSvarRequest: AktivitetReiseTilSamlingTsrFaktaOgSvar = {
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSR',
};
