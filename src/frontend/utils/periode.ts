import { v4 as uuidv4 } from 'uuid';

import { dagenFør, datoErIPeriodeInklusivSlutt, erDatoEtterEllerLik } from './dato';

export type Periode = {
    fom: string;
    tom: string;
};

export interface PeriodeMedEndretKey extends Periode {
    endretKey: string; // intern for re-rendring
}

export const validerPeriode = (
    periode: Periode,
    lagretPeriode?: Periode,
    revurderFra?: string
): undefined | Partial<Periode> => {
    if (!periode.fom) {
        return { fom: 'Mangler fra-dato' };
    }

    if (!periode.tom) {
        return { tom: 'Mangler til-dato' };
    }

    if (!erDatoEtterEllerLik(periode.fom, periode.tom)) {
        return {
            tom: 'Til-dato må være etter fra-dato',
        };
    }

    const valideringsfeilForRevurdering = validerPeriodeRevurdering(
        periode,
        lagretPeriode,
        revurderFra
    );

    return valideringsfeilForRevurdering;
};

const validerPeriodeRevurdering = (
    oppdatertPeriode: Periode,
    lagretPeriode?: Periode,
    revurderFra?: string
): Partial<Periode> | undefined => {
    if (!revurderFra) return undefined;

    // Validering av perioder hvor kun tom kan endres
    const tidligsteMuligeTom = dagenFør(revurderFra);
    if (
        lagretPeriode &&
        datoErIPeriodeInklusivSlutt(tidligsteMuligeTom, lagretPeriode.fom, lagretPeriode.tom)
    ) {
        return validerTomEtterEllerLikRevurderingsdato(oppdatertPeriode.tom, tidligsteMuligeTom);
    }

    return validerFomEtterEllerLikRevurderingsdato(
        revurderFra,
        oppdatertPeriode.fom,
        lagretPeriode?.fom
    );
};

const validerFomEtterEllerLikRevurderingsdato = (
    revurderFra: string,
    nyFom: string,
    lagretFom?: string
) => {
    if (nyFom === lagretFom) return undefined;

    if (!erDatoEtterEllerLik(revurderFra, nyFom)) {
        return {
            fom: 'Fra-dato må være etter eller lik datoen revurderingen gjelder fra',
        };
    }
};

const validerTomEtterEllerLikRevurderingsdato = (tom: string, tidligsteMuligeTom: string) => {
    if (!erDatoEtterEllerLik(tidligsteMuligeTom, tom)) {
        return {
            tom: 'Til-dato kan tidligst settes til dagen før revurderingen gjelder fra',
        };
    }
};

export const tilPeriodeMedEndretKey = (utgifter: Periode[]): PeriodeMedEndretKey[] =>
    utgifter.map((utgift) => ({ ...utgift, endretKey: uuidv4() }));
