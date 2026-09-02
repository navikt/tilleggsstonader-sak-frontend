import { EndreAktivitetFormDagligReiseTsr } from './EndreAktivitetDagligReiseTsr';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Kodeverk } from '../../../../typer/kodeverk';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import {
    AktivitetDagligReiseTsr,
    AktivitetDagligReiseTsrFaktaOgSvar,
} from '../typer/vilkårperiode/aktivitetDagligReiseTsr';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormDagligReiseTsr =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetDagligReiseTsr
): EndreAktivitetFormDagligReiseTsr => ({
    ...eksisterendeAktivitet,
    svarHarUtgifter: eksisterendeAktivitet.faktaOgVurderinger.harUtgifter?.svar,
    aktivitetsdager: eksisterendeAktivitet.faktaOgVurderinger.aktivitetsdager,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormDagligReiseTsr {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        tiltaksvariant: tiltaksvariantForRegisterAktivitet(aktivitetFraRegister),
        svarHarUtgifter: undefined,
        aktivitetsdager: aktivitetFraRegister.antallDagerPerUke,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        kildeId: aktivitetFraRegister.id,
    };
}

/**
 * Aktiviteter fra Arena har alltid en tiltaksvariant (type/typeNavn). Denne kan brukes direkte som
 * tiltaksvariant på aktiviteten, selv om varianten ikke finnes i det reduserte utvalget som vises i
 * dropdownen for manuelt tillagte aktiviteter (`tiltaksvariantValg`). En tiltaksvariant som ikke er
 * mappet til en utbetalingstype vil ikke kunne innvilges med, man skal kunne velges i tilfelle avslag.
 */
function tiltaksvariantForRegisterAktivitet(registerAktivitet: Registeraktivitet): Kodeverk {
    return { kode: registerAktivitet.type, beskrivelse: registerAktivitet.typeNavn };
}

export function finnTiltaksvariantForKode(
    registerAktivitetKode: string,
    tiltaksvariantValg: Kodeverk[]
) {
    return tiltaksvariantValg.find(
        (tiltaksvariantValg) => tiltaksvariantValg.kode === registerAktivitetKode
    );
}

function nyTomAktivitet(): EndreAktivitetFormDagligReiseTsr {
    return {
        type: '',
        tiltaksvariant: undefined,
        svarHarUtgifter: undefined,
        aktivitetsdager: undefined,
        fom: '',
        tom: '',
    };
}

export const skalVurdereLønnet = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormDagligReiseTsr,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormDagligReiseTsr => {
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
    eksisterendeForm: EndreAktivitetFormDagligReiseTsr,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[Stønadstype.DAGLIG_REISE_TSR],
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
    svarHarUtgifter: SvarJaNei | undefined
) => {
    const delvilkårSomMåBegrunnes = [];
    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
    }
    if (svarHarUtgifter === SvarJaNei.NEI) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.HAR_UTGIFTER);
    }

    return delvilkårSomMåBegrunnes;
};

export const mapFaktaOgSvarTilRequest = (
    aktivitetForm: EndreAktivitetFormDagligReiseTsr
): AktivitetDagligReiseTsrFaktaOgSvar => ({
    '@type': 'AKTIVITET_DAGLIG_REISE_TSR',
    svarHarUtgifter: aktivitetForm.svarHarUtgifter,
    aktivitetsdager: aktivitetForm.aktivitetsdager,
});
