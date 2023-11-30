import { MålgruppePeriode, RegistrerDataForm } from './typer';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { erDatoEtterEllerLik } from '../../../../utils/dato';

export const validerRegistrerDataForm = ({
    målgruppePerioder,
}: RegistrerDataForm): FormErrors<RegistrerDataForm> => {
    return {
        ...validerPerioder({
            målgruppePerioder,
        }),
    };
};

export const validerPerioder = ({
    målgruppePerioder,
}: {
    målgruppePerioder: MålgruppePeriode[];
}): FormErrors<{
    målgruppePerioder: MålgruppePeriode[];
}> => {
    return {
        ...validerMålgruppePerioder(målgruppePerioder),
    };
};

const validerMålgruppePerioder = (
    målgruppePerioder: MålgruppePeriode[]
): FormErrors<{
    målgruppePerioder: MålgruppePeriode[];
}> => {
    const feilIMålgruppePerioder = målgruppePerioder.map((periode) => {
        const målgruppePeriodeFeil: FormErrors<MålgruppePeriode> = {
            fom: undefined,
            tom: undefined,
            type: undefined,
        };

        if (!periode.fom) {
            return { ...målgruppePeriodeFeil, fom: 'Mangler fradato for periode' };
        }

        if (!periode.tom) {
            return { ...målgruppePeriodeFeil, tom: 'Mangler tildato for periode' };
        }

        if (!erDatoEtterEllerLik(periode.tom, periode.fom)) {
            return {
                ...målgruppePeriodeFeil,
                tom: 'Sluttdato (til) må være etter startdato (fra) for periode',
            };
        }

        return målgruppePeriodeFeil;
    });

    return {
        målgruppePerioder: feilIMålgruppePerioder,
    };
};
