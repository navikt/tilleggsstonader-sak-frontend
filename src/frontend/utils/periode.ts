import { dagenFør, datoErIPeriodeInklusivSlutt, erDatoEtterEllerLik } from './dato';

export type Periode = {
    fom: string;
    tom: string;
};

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
    if (
        lagretPeriode &&
        datoErIPeriodeInklusivSlutt(revurderFra, lagretPeriode.fom, lagretPeriode.tom)
    ) {
        return validerTomEtterEllerLikRevurderingsdato(oppdatertPeriode.tom, revurderFra);
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

const validerTomEtterEllerLikRevurderingsdato = (tom: string, revurderFra: string) => {
    const tidligsteMuligeTom = dagenFør(revurderFra);
    if (!erDatoEtterEllerLik(tidligsteMuligeTom, tom)) {
        return {
            tom: 'Til-dato kan tidligst settes til dagen før revurderingen gjelder fra',
        };
    }
};
