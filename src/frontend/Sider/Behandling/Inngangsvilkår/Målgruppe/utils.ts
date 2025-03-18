import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import {
    registerYtelseTilTekstStorForbokstav,
    typeRegisterYtelseTilMålgruppeType,
} from '../../../../typer/registerytelser';
import { dagensDato, førsteDagIMånederForut } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { ingenMålgruppeAktivitetAntallMndBakITiden } from '../../Felles/grunnlagAntallMndBakITiden';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import {
    MålgruppeFaktaOgSvar,
    FaktiskMålgruppe,
    Målgruppe,
    MålgruppeType,
    MålgruppeTypeTilFaktiskMålgruppe,
    SvarMålgruppe,
} from '../typer/vilkårperiode/målgruppe';
import {
    SubtypeYtelseGrunnlag,
    SvarJaNei,
    YtelseGrunnlagPeriode,
} from '../typer/vilkårperiode/vilkårperiode';
import { BegrunnelseGrunner } from '../Vilkårperioder/Begrunnelse/utils';
import { kanRegisterperiodeBrukes } from '../Vilkårperioder/vilkårperiodeUtil';

export type MålgrupperMedMedlemskapsvurdering =
    | MålgruppeType.NEDSATT_ARBEIDSEVNE
    | MålgruppeType.OMSTILLINGSSTØNAD;

export const nyMålgruppe = (
    registrertYtelsePeriode?: YtelseGrunnlagPeriode
): EndreMålgruppeForm => {
    return registrertYtelsePeriode
        ? nyMålgruppeFraRegister(registrertYtelsePeriode)
        : tomMålgruppeForm();
};

export const mapEksisterendeMålgruppe = (eksisterendeMålgruppe: Målgruppe): EndreMålgruppeForm => ({
    ...eksisterendeMålgruppe,
    vurderinger: {
        svarMedlemskap: eksisterendeMålgruppe.faktaOgVurderinger.medlemskap?.svar,
        svarUtgifterDekketAvAnnetRegelverk:
            eksisterendeMålgruppe.faktaOgVurderinger.utgifterDekketAvAnnetRegelverk?.svar,
        svarMottarSykepengerForFulltidsstilling:
            eksisterendeMålgruppe.faktaOgVurderinger.mottarSykepengerForFulltidsstilling?.svar,
    },
});

const nyMålgruppeFraRegister = (
    registrertYtelsePeriode: YtelseGrunnlagPeriode
): EndreMålgruppeForm => {
    const type = typeRegisterYtelseTilMålgruppeType[registrertYtelsePeriode.type];
    return {
        type: type,
        fom: registrertYtelsePeriode.fom,
        tom: registrertYtelsePeriode.tom || '',
        vurderinger: resetVurderinger(type, tomVurderingerMålgruppe),
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
};

export const målgrupperHvorMedlemskapMåVurderes = [
    MålgruppeType.NEDSATT_ARBEIDSEVNE,
    MålgruppeType.UFØRETRYGD,
    MålgruppeType.OMSTILLINGSSTØNAD,
];

export const målgruppeErNedsattArbeidsevne = (målgruppeType: MålgruppeType) => {
    return MålgruppeTypeTilFaktiskMålgruppe[målgruppeType] === FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE;
};

export const skalVurdereDekkesAvAnnetRegelverk = (type: MålgruppeType) =>
    målgruppeErNedsattArbeidsevne(type);

export const skalVurdereMottarSykepengerForFulltidsstilling = (
    type: MålgruppeType,
    stønadstype: Stønadstype
) => stønadstype !== Stønadstype.LÆREMIDLER && type === MålgruppeType.NEDSATT_ARBEIDSEVNE;

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
        vurderinger: resetVurderinger(nyType, eksisterendeForm.vurderinger),
    };
};

const resetPeriode = (
    stønadstype: Stønadstype,
    nyType: string,
    eksisterendeForm: EndreMålgruppeForm,
    søknadMottattTidspunkt?: string
): Periode => {
    if (nyType === MålgruppeType.INGEN_MÅLGRUPPE) {
        return {
            fom: førsteDagIMånederForut(
                ingenMålgruppeAktivitetAntallMndBakITiden[stønadstype],
                søknadMottattTidspunkt
            ),
            tom: dagensDato(),
        };
    }

    if (eksisterendeForm.type === MålgruppeType.INGEN_MÅLGRUPPE) {
        // Resetter datoer om de forrige var satt automatisk
        return { fom: '', tom: '' };
    }

    return { fom: eksisterendeForm.fom, tom: eksisterendeForm.tom };
};

const resetVurderinger = (
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
});

const dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler = (eksisterendeVurderinger: SvarMålgruppe) =>
    eksisterendeVurderinger.svarUtgifterDekketAvAnnetRegelverk || SvarJaNei.NEI;

export const finnBegrunnelseGrunnerMålgruppe = (
    type: MålgruppeType | '',
    vurderinger: SvarMålgruppe
) => {
    const delvilkårSomMåBegrunnes = [];

    if (type === MålgruppeType.NEDSATT_ARBEIDSEVNE) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.NEDSATT_ARBEIDSEVNE);
    }

    if (type !== '' && målgrupperHvorMedlemskapMåVurderes.includes(type)) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.MEDLEMSKAP);
    }

    if (type === MålgruppeType.INGEN_MÅLGRUPPE) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.INGEN_MÅLGRUPPE);
    }

    if (type === MålgruppeType.SYKEPENGER_100_PROSENT) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.SYKEPENGER_100_PROSENT);
    }

    if (vurderinger.svarUtgifterDekketAvAnnetRegelverk === SvarJaNei.JA) {
        delvilkårSomMåBegrunnes.push(BegrunnelseGrunner.DEKKET_AV_ANNET_REGELVERK);
    }

    return delvilkårSomMåBegrunnes;
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
});

export const utledYtelseTekst = (periode: YtelseGrunnlagPeriode): string => {
    return `${registerYtelseTilTekstStorForbokstav[periode.type]}${periode.subtype === SubtypeYtelseGrunnlag.AAP_FERDIG_AVKLART ? ' (Ferdig avklart)' : ''}`;
};

export const kanRegisterYtelseBrukes = (
    ytelse: YtelseGrunnlagPeriode,
    revurderFra?: string
): boolean => {
    if (ytelse.subtype === SubtypeYtelseGrunnlag.AAP_FERDIG_AVKLART) return false;

    return kanRegisterperiodeBrukes(ytelse, revurderFra);
};
