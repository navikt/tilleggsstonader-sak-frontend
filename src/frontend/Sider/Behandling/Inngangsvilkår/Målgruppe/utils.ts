import { registerYtelseTilTekstStorForbokstav } from '../../../../typer/registerytelser';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';
import {
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
import { kanRegisterperiodeBrukes } from '../Vilkårperioder/vilkårperiodeUtil';

export type MålgrupperMedMedlemskapsvurdering =
    | MålgruppeType.NEDSATT_ARBEIDSEVNE
    | MålgruppeType.OMSTILLINGSSTØNAD;

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

export const dekkesAvAnnetRegelverkAutomatiskNeiHvisMangler = (
    eksisterendeVurderinger: SvarMålgruppe
) => eksisterendeVurderinger.svarUtgifterDekketAvAnnetRegelverk || SvarJaNei.NEI;

export const erMålgruppe = (vilkårperiode: Målgruppe | Aktivitet): vilkårperiode is Målgruppe => {
    return vilkårperiode.type in MålgruppeType;
};

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
