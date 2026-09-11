import { erDatoEtterEllerLik } from './dato';

export type Periode = {
    fom: string;
    tom: string;
};

export const validerPeriode = (periode: Periode): undefined | Partial<Periode> => {
    const feil: Partial<Periode> = {};

    if (!periode.fom) {
        feil.fom = 'Mangler fra-dato';
    }

    if (!periode.tom) {
        feil.tom = 'Mangler til-dato';
    }

    if (periode.fom && periode.tom && !erDatoEtterEllerLik(periode.fom, periode.tom)) {
        feil.tom = 'Til-dato må være etter fra-dato';
    }

    if (Object.keys(feil).length === 0) return undefined;
    return feil;
};

export const tomPeriode: Periode = { fom: '', tom: '' };
