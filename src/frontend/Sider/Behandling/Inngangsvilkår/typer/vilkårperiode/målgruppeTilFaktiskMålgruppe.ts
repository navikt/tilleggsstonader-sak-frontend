import { MålgruppeType } from './målgruppe';
import { FaktiskMålgruppe } from '../../../Felles/faktiskMålgruppe';

export enum MålgruppeSomIkkeGirRettPåStønad {
    SYKEPENGER_100_PROSENT = 'SYKEPENGER_100_PROSENT',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export type FaktiskMålgruppeEllerIngenMålgruppe =
    | FaktiskMålgruppe
    | MålgruppeSomIkkeGirRettPåStønad;

export const målgruppeTilFaktiskMålgruppeEllerIngenMålgruppe: Record<
    MålgruppeType,
    FaktiskMålgruppeEllerIngenMålgruppe
> = {
    AAP: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    DAGPENGER: FaktiskMålgruppe.DAGPENGER,
    UFØRETRYGD: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    OMSTILLINGSSTØNAD: FaktiskMålgruppe.GJENLEVENDE,
    OVERGANGSSTØNAD: FaktiskMålgruppe.ENSLIG_FORSØRGER,
    NEDSATT_ARBEIDSEVNE: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    SYKEPENGER_100_PROSENT: MålgruppeSomIkkeGirRettPåStønad.SYKEPENGER_100_PROSENT,
    INGEN_MÅLGRUPPE: MålgruppeSomIkkeGirRettPåStønad.INGEN_MÅLGRUPPE,
    GJENLEVENDE_GAMMELT_REGELVERK: FaktiskMålgruppe.GJENLEVENDE,
};
