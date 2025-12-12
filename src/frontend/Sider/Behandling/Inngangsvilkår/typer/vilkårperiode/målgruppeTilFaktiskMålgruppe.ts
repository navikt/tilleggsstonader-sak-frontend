import { MålgruppeType } from './målgruppe';
import { FaktiskMålgruppe, FaktiskMålgruppeTilTekst } from '../../../Felles/faktiskMålgruppe';

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
    UFØRETRYGD: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    OMSTILLINGSSTØNAD: FaktiskMålgruppe.GJENLEVENDE,
    OVERGANGSSTØNAD: FaktiskMålgruppe.ENSLIG_FORSØRGER,
    NEDSATT_ARBEIDSEVNE: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    SYKEPENGER_100_PROSENT: MålgruppeSomIkkeGirRettPåStønad.SYKEPENGER_100_PROSENT,
    INGEN_MÅLGRUPPE: MålgruppeSomIkkeGirRettPåStønad.INGEN_MÅLGRUPPE,
    GJENLEVENDE_GAMMELT_REGELVERK: FaktiskMålgruppe.GJENLEVENDE,
    DAGPENGER: FaktiskMålgruppe.ARBEIDSSØKER,
    TILTAKSPENGER: FaktiskMålgruppe.ARBEIDSSØKER,
    KVALIFISERINGSSTØNAD: FaktiskMålgruppe.ARBEIDSSØKER,
};

export const informasjonForFaktisktMålgruppe: Record<FaktiskMålgruppeEllerIngenMålgruppe, string> =
    {
        ...FaktiskMålgruppeTilTekst,
        SYKEPENGER_100_PROSENT: 'Ikke i målgruppe',
        INGEN_MÅLGRUPPE: 'Ikke i målgruppe',
    };

export const målgruppeTilFaktiskMålgruppeTekst = (type: MålgruppeType) => {
    const faktiskMålgruppe = målgruppeTilFaktiskMålgruppeEllerIngenMålgruppe[type];
    return informasjonForFaktisktMålgruppe[faktiskMålgruppe];
};
