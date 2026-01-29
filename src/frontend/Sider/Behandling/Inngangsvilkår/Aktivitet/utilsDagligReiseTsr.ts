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
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined,
    typeAktivitetValg: Kodeverk[]
): EndreAktivitetFormDagligReiseTsr =>
    aktivitetFraRegister
        ? nyAktivitetFraRegister(aktivitetFraRegister, typeAktivitetValg)
        : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetDagligReiseTsr
): EndreAktivitetFormDagligReiseTsr => ({
    ...eksisterendeAktivitet,
    svarHarUtgifter: eksisterendeAktivitet.faktaOgVurderinger.harUtgifter?.svar,
    aktivitetsdager: eksisterendeAktivitet.faktaOgVurderinger.aktivitetsdager,
});

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet,
    typeAktivitetValg: Kodeverk[]
): EndreAktivitetFormDagligReiseTsr {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        typeAktivitet: finnTypeAktivitetForRegisterAktivitet(
            aktivitetFraRegister,
            typeAktivitetValg
        ),
        svarHarUtgifter: undefined,
        aktivitetsdager: aktivitetFraRegister.antallDagerPerUke,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        kildeId: aktivitetFraRegister.id,
    };
}

function finnTypeAktivitetForRegisterAktivitet(
    registerAktivitet: Registeraktivitet,
    typeAktivitetValg: Kodeverk[]
) {
    return typeAktivitetValg.find(
        (typeAktivitetValg) => typeAktivitetValg.beskrivelse === registerAktivitet.typeNavn
    );
}

export function finnTypeAktivitetForKode(
    registerAktivitetKode: string,
    typeAktivitetValg: Kodeverk[]
) {
    return typeAktivitetValg.find(
        (typeAktivitetValg) => typeAktivitetValg.kode === registerAktivitetKode
    );
}

function nyTomAktivitet(): EndreAktivitetFormDagligReiseTsr {
    return {
        type: '',
        typeAktivitet: undefined,
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

export const finnBegrunnelseGrunnerAktivitet = (type: AktivitetType | '') => {
    const delvilkårSomMåBegrunnes = [];
    if (type === AktivitetType.INGEN_AKTIVITET) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_AKTIVITET);
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
