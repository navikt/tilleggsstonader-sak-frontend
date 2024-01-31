import { erDatoEtterEllerLik, erDatoFørEllerLik } from './dato';
import { FormErrors } from '../hooks/felles/useFormState';

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
        return { fom: 'Mangler fradato for periode' };
    }

    if (!periode.tom) {
        return { tom: 'Mangler tildato for periode' };
    }

    if (!erDatoEtterEllerLik(periode.fom, periode.tom)) {
        return {
            tom: 'Sluttdato (til) må være etter startdato (fra) for periode',
        };
    }
    return undefined;
};

export const validerPeriodeForm = (målgruppe: Periode): FormErrors<Periode> => {
    const feil: FormErrors<Periode> = {
        fom: undefined,
        tom: undefined,
    };

    const periodeValidering = validerPeriode(målgruppe);
    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }

    return feil;
};
