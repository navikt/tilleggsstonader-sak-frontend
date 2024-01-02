import { erDatoEtterEllerLik, erDatoFørEllerLik } from './dato';

export type Periode = {
    fom: string;
    tom: string;
};

export const erPeriodeInnenforAnnenPeriode = (periode: Periode, annenPeriode: Periode): boolean => {
    return (
        erDatoEtterEllerLik(periode.fom, annenPeriode.fom) &&
        erDatoFørEllerLik(periode.tom, annenPeriode.tom)
    );
};

export const validerPeriode = (periode: Periode): undefined | Partial<Periode> => {
    if (!periode.fom) {
        return { fom: 'Mangler fradato for periode' };
    }

    if (!periode.tom) {
        return { tom: 'Mangler tildato for periode' };
    }

    if (!erDatoEtterEllerLik(periode.tom, periode.fom)) {
        return {
            tom: 'Sluttdato (til) må være etter startdato (fra) for periode',
        };
    }
    return undefined;
};
