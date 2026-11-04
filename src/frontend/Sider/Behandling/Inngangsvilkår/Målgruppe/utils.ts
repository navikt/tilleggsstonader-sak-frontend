import { EndreMålgruppeForm } from './EndreMålgruppe';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import {
    registerYtelseTilTekstStorForbokstav,
    typeRegisterYtelseTilMålgruppeType,
} from '../../../../typer/registerytelser';
import { dagensDato, førsteDagIMånederForut, leggTilMåneder } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { FaktiskMålgruppe } from '../../Felles/faktiskMålgruppe';
import { maksMånederTilbakeFraSøknadsdato } from '../../Felles/grunnlagAntallMndBakITiden';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import {
    Målgruppe,
    MålgruppeFaktaOgSvar,
    MålgruppeType,
    SvarMålgruppe,
    erOpphørtStønadsMålgruppe,
} from '../typer/vilkårperiode/målgruppe';
import { målgruppeTilFaktiskMålgruppeEllerIngenMålgruppe } from '../typer/vilkårperiode/målgruppeTilFaktiskMålgruppe';
import {
    SubtypeYtelseGrunnlag,
    SvarJaNei,
    YtelseGrunnlagPeriode,
} from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';

export const nyMålgruppe = (
    stønadstype: Stønadstype,
    registrertYtelsePeriode?: YtelseGrunnlagPeriode
): EndreMålgruppeForm => {
    return registrertYtelsePeriode
        ? nyMålgruppeFraRegister(stønadstype, registrertYtelsePeriode)
        : tomMålgruppeForm();
};

export const mapEksisterendeMålgruppe = (eksisterendeMålgruppe: Målgruppe): EndreMålgruppeForm => ({
    ...eksisterendeMålgruppe,
    vurderinger: {
        svarMedlemskap: eksisterendeMålgruppe.faktaOgVurderinger.medlemskap?.svar,
        svarUtgifterDekketAvAnnetRegelverk:
            eksisterendeMålgruppe.faktaOgVurderinger.utgifterDekketAvAnnetRegelverk?.svar,
        svarMottarSykepengerForFulltidsstilling: nullstillGammelManglerData(
            eksisterendeMålgruppe.faktaOgVurderinger.mottarSykepengerForFulltidsstilling?.svar
        ),
        svarLønnet: eksisterendeMålgruppe.faktaOgVurderinger.lønnet?.svar,
    },
});

/**
 * GAMMEL_MANGLER_DATA er kun et gyldig svar dersom alle felter utenom tom er låst.
 * Dersom alle felter (fakta og vurderinger) kan redigeres,
 * skal svar settes til undefined slik at saksbehandler må ta stilling til vilkåret.
 */
const nullstillGammelManglerData = (
    svar: SvarJaNei | undefined | 'GAMMEL_MANGLER_DATA'
): SvarJaNei | 'GAMMEL_MANGLER_DATA' | undefined => {
    if (svar === 'GAMMEL_MANGLER_DATA') return undefined;

    return svar;
};

const nyMålgruppeFraRegister = (
    stønadstype: Stønadstype,
    registrertYtelsePeriode: YtelseGrunnlagPeriode
): EndreMålgruppeForm => {
    const type = typeRegisterYtelseTilMålgruppeType[registrertYtelsePeriode.type];
    return {
        type: type,
        fom: registrertYtelsePeriode.fom,
        tom: registrertYtelsePeriode.tom || '',
        vurderinger: resetVurderinger(stønadstype, type, tomVurderingerMålgruppe),
    };
};

const tomMålgruppeForm = (): EndreMålgruppeForm => {
    return {
        type: '',
        fom: '',
        tom: '',
        vurderinger: tomVurderingerMålgruppe,
    };
};

const tomVurderingerMålgruppe: SvarMålgruppe = {
    svarMedlemskap: undefined,
    svarUtgifterDekketAvAnnetRegelverk: undefined,
    svarMottarSykepengerForFulltidsstilling: undefined,
    svarLønnet: undefined,
};

export const målgrupperHvorMedlemskapMåVurderes = [
    MålgruppeType.NEDSATT_ARBEIDSEVNE,
    MålgruppeType.UFØRETRYGD,
    MålgruppeType.OMSTILLINGSSTØNAD,
];

export const målgruppeErNedsattArbeidsevne = (målgruppeType: MålgruppeType) => {
    return (
        målgruppeTilFaktiskMålgruppeEllerIngenMålgruppe[målgruppeType] ===
        FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE
    );
};

export const skalVurdereDekkesAvAnnetRegelverk = (type: MålgruppeType) =>
    målgruppeErNedsattArbeidsevne(type);

export const skalVurdereMottarSykepengerForFulltidsstilling = (
    type: MålgruppeType,
    stønadstype: Stønadstype
) => stønadstype !== Stønadstype.LÆREMIDLER && type === MålgruppeType.NEDSATT_ARBEIDSEVNE;

const målgrupperHvorLønnetMåVurderesForFlyttingTso = [
    MålgruppeType.AAP,
    MålgruppeType.UFØRETRYGD,
    MålgruppeType.NEDSATT_ARBEIDSEVNE,
    MålgruppeType.AKTIVITETSPENGER,
];

/**
 * Aktivitet vurderes ikke for flytting TSO. Lønn i tiltaket vurderes derfor på målgruppen.
 */
export const skalVurdereLønnetForMålgruppe = (type: MålgruppeType | '', stønadstype: Stønadstype) =>
    stønadstype === Stønadstype.FLYTTING_TSO &&
    type !== '' &&
    målgrupperHvorLønnetMåVurderesForFlyttingTso.includes(type);

export const resettMålgruppe = (
    stønadstype: Stønadstype,
    nyType: MålgruppeType,
    eksisterendeForm: EndreMålgruppeForm,
    søknadMottattTidspunkt?: string
): EndreMålgruppeForm => {
    const { fom, tom } = resetPeriode(
        stønadstype,
        nyType,
        eksisterendeForm,
        søknadMottattTidspunkt
    );
    return {
        ...eksisterendeForm,
        type: nyType,
        fom: fom,
        tom: tom,
        vurderinger: resetVurderinger(stønadstype, nyType, eksisterendeForm.vurderinger),
    };
};

const resetPeriode = (
    stønadstype: Stønadstype,
    nyType: MålgruppeType,
    eksisterendeForm: EndreMålgruppeForm,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === MålgruppeType.INGEN_MÅLGRUPPE) {
        return {
            fom: førsteDagIMånederForut(
                maksMånederTilbakeFraSøknadsdato[stønadstype],
                søknadMottattTidspunkt
            ),
            tom: dagensDato(),
        };
    }

    if (eksisterendeForm.type === MålgruppeType.INGEN_MÅLGRUPPE) {
        // Resetter datoer om de forrige var satt automatisk
        return { fom: '', tom: '' };
    }

    if (erOpphørtStønadsMålgruppe(nyType)) {
        return {
            fom: eksisterendeForm.fom,
            tom: eksisterendeForm.fom ? leggTilMåneder(eksisterendeForm.fom, 6) : '',
        };
    }

    if (erOpphørtStønadsMålgruppe(eksisterendeForm.type)) {
        return { fom: eksisterendeForm.fom, tom: '' };
    }

    return { fom: eksisterendeForm.fom, tom: eksisterendeForm.tom };
};

const resetVurderinger = (
    stønadstype: Stønadstype,
    type: MålgruppeType,
    eksisterendeVurderinger: SvarMålgruppe
): SvarMålgruppe => ({
    ...eksisterendeVurderinger,
    svarMedlemskap: målgrupperHvorMedlemskapMåVurderes.includes(type)
        ? eksisterendeVurderinger.svarMedlemskap
        : undefined,
    svarUtgifterDekketAvAnnetRegelverk: skalVurdereDekkesAvAnnetRegelverk(type)
        ? dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler(eksisterendeVurderinger)
        : undefined,
    svarLønnet: skalVurdereLønnetForMålgruppe(type, stønadstype)
        ? eksisterendeVurderinger.svarLønnet
        : undefined,
});

const dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler = (eksisterendeVurderinger: SvarMålgruppe) =>
    eksisterendeVurderinger.svarUtgifterDekketAvAnnetRegelverk || SvarJaNei.NEI;

export const finnBegrunnelseGrunnerMålgruppe = (
    type: MålgruppeType | '',
    vurderinger: SvarMålgruppe,
    registerYtelse?: YtelseGrunnlagPeriode
) => {
    const begrunnelseGrunner = [];

    if (type === MålgruppeType.NEDSATT_ARBEIDSEVNE) {
        begrunnelseGrunner.push(BegrunnelseGrunner.NEDSATT_ARBEIDSEVNE);
    }

    if (type !== '' && målgrupperHvorMedlemskapMåVurderes.includes(type)) {
        begrunnelseGrunner.push(BegrunnelseGrunner.MEDLEMSKAP);
    }

    if (type === MålgruppeType.INGEN_MÅLGRUPPE) {
        begrunnelseGrunner.push(BegrunnelseGrunner.INGEN_MÅLGRUPPE);
    }

    if (type === MålgruppeType.SYKEPENGER_100_PROSENT) {
        begrunnelseGrunner.push(BegrunnelseGrunner.SYKEPENGER_100_PROSENT);
    }

    if (vurderinger.svarLønnet === SvarJaNei.JA) {
        begrunnelseGrunner.push(BegrunnelseGrunner.LØNNET);
    }

    if (vurderinger.svarUtgifterDekketAvAnnetRegelverk === SvarJaNei.JA) {
        begrunnelseGrunner.push(BegrunnelseGrunner.DEKKET_AV_ANNET_REGELVERK);
    }

    if (registerYtelse && registerYtelse.tom === null) {
        begrunnelseGrunner.push(BegrunnelseGrunner.UKJENT_TOM_FRA_REGISTER);
    }

    return begrunnelseGrunner;
};

export const erMålgruppe = (vilkårperiode: Målgruppe | Aktivitet): vilkårperiode is Målgruppe => {
    return vilkårperiode.type in MålgruppeType;
};

export const mapFaktaOgSvarTilRequest = (
    målgruppeForm: EndreMålgruppeForm
): MålgruppeFaktaOgSvar => ({
    '@type': 'MÅLGRUPPE',
    svarMedlemskap: målgruppeForm.vurderinger.svarMedlemskap,
    svarUtgifterDekketAvAnnetRegelverk:
        målgruppeForm.vurderinger.svarUtgifterDekketAvAnnetRegelverk,
    svarMottarSykepengerForFulltidsstilling:
        målgruppeForm.vurderinger.svarMottarSykepengerForFulltidsstilling,
    svarLønnet: målgruppeForm.vurderinger.svarLønnet,
});

const hentEkstraInformasjonYtelse = (periode: YtelseGrunnlagPeriode): string => {
    if (periode.subtype === SubtypeYtelseGrunnlag.AAP_FERDIG_AVKLART) {
        return ' (ferdig avklart)';
    }

    if (periode.erNyttRegelverk2026) {
        return ' (nytt regelverk 2026)';
    }

    return '';
};

export const utledYtelseTekst = (periode: YtelseGrunnlagPeriode): string => {
    return `${registerYtelseTilTekstStorForbokstav(periode.type)}${hentEkstraInformasjonYtelse(periode)}`;
};
