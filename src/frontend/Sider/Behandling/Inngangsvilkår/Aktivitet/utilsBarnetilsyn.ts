import { EndreAktivitetFormBarnetilsyn } from './EndreAktivitetBarnetilsyn';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { ingenMålgruppeAktivitetAntallMndBakITiden } from '../../Felles/grunnlagAntallMndBakITiden';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { AktivitetBarnetilsynFaktaOgSvar } from '../typer/vilkårperiode/aktivitetBarnetilsyn';
import { AktivitetBarnetilsyn } from '../typer/vilkårperiode/aktivitetBarnetilsyn';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyAktivitet = (
    aktivitetFraRegister: Registeraktivitet | undefined
): EndreAktivitetFormBarnetilsyn =>
    aktivitetFraRegister ? nyAktivitetFraRegister(aktivitetFraRegister) : nyTomAktivitet();

export const mapEksisterendeAktivitet = (
    eksisterendeAktivitet: AktivitetBarnetilsyn
): EndreAktivitetFormBarnetilsyn => ({
    ...eksisterendeAktivitet,
    aktivitetsdager: eksisterendeAktivitet.faktaOgVurderinger.aktivitetsdager,
    svarLønnet: eksisterendeAktivitet.faktaOgVurderinger.lønnet?.svar,
});

/**
 * Prefyller aktivtetsdager med 5 dager hvis det gjelder utdanning då feltet mangler fra arena
 * Ellers brukes antallDagerPerUke
 */
const aktivitetsdagerFraRegister = (aktivitetFraRegister: Registeraktivitet) =>
    aktivitetFraRegister.erUtdanning ? 5 : aktivitetFraRegister.antallDagerPerUke;

function nyAktivitetFraRegister(
    aktivitetFraRegister: Registeraktivitet
): EndreAktivitetFormBarnetilsyn {
    return {
        type: aktivitetFraRegister.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK,
        fom: aktivitetFraRegister.fom || '',
        tom: aktivitetFraRegister.tom || '',
        aktivitetsdager: aktivitetsdagerFraRegister(aktivitetFraRegister),
        svarLønnet: undefined,
        kildeId: aktivitetFraRegister.id,
    };
}

function nyTomAktivitet(): EndreAktivitetFormBarnetilsyn {
    return {
        type: '',
        fom: '',
        tom: '',
        aktivitetsdager: undefined,
        svarLønnet: undefined,
    };
}

export const skalVurdereLønnet = (type: AktivitetType | '') => type === AktivitetType.TILTAK;

export const resettAktivitet = (
    nyType: AktivitetType,
    eksisterendeAktivitetForm: EndreAktivitetFormBarnetilsyn,
    søknadMottattTidspunkt?: string
): EndreAktivitetFormBarnetilsyn => {
    const { fom, tom } = resetPeriode(nyType, eksisterendeAktivitetForm, søknadMottattTidspunkt);

    return {
        ...eksisterendeAktivitetForm,
        type: nyType,
        fom: fom,
        tom: tom,
        aktivitetsdager: resetAktivitetsdager(nyType, eksisterendeAktivitetForm),
        svarLønnet: undefined,
    };
};

const resetPeriode = (
    nyType: string,
    eksisterendeForm: EndreAktivitetFormBarnetilsyn,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return {
            fom: førsteDagIMånederForut(
                ingenMålgruppeAktivitetAntallMndBakITiden[Stønadstype.BARNETILSYN],
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

const resetAktivitetsdager = (
    nyType: AktivitetType,
    eksisterendeForm: EndreAktivitetFormBarnetilsyn
) => {
    if (nyType === AktivitetType.INGEN_AKTIVITET) {
        return undefined;
    } else if (!harTallverdi(eksisterendeForm.aktivitetsdager)) {
        return 5;
    }

    return eksisterendeForm.aktivitetsdager;
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
    aktivitetForm: EndreAktivitetFormBarnetilsyn
): AktivitetBarnetilsynFaktaOgSvar => ({
    '@type': 'AKTIVITET_BARNETILSYN',
    aktivitetsdager: aktivitetForm.aktivitetsdager,
    svarLønnet: aktivitetForm.svarLønnet,
});
