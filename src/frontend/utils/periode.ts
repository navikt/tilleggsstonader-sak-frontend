import { erDatoEtterEllerLik } from './dato';

export type Periode = {
    fom: string;
    tom: string;
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
            tom: 'Til-dato må være etter fra-dato',
        };
    }
};
