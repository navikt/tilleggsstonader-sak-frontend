import { erDatoEtterEllerLik, erDatoFørEllerLik } from './dato';

export type Periode = {
    fom: string;
    tom: string;
};

export const erPeriodeInnenforAnnenPeriode = (periode: Periode, annenPeriode: Periode): boolean => {
    return (
        erDatoEtterEllerLik(annenPeriode.fom, periode.fom) &&
        erDatoFørEllerLik(periode.tom, annenPeriode.tom)
    );
};

export const validerPeriode = (periode: Periode): undefined | Partial<Periode> => {
    if (!periode.fom) {
        return { fom: 'Mangler fra-dato' };
    }

    if (!periode.tom) {
        return { tom: 'Mangler til-dato' };
    }

    if (!erDatoEtterEllerLik(periode.fom, periode.tom)) {
        return {
            tom: 'Til-dato må være etter før-dato',
        };
    }
    return undefined;
};
