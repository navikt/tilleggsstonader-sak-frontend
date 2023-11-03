import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Stønadsperiode, Utgift } from '../../../../../typer/vedtak';
import { erDatoEtterEllerLik } from '../../../../../utils/dato';
import { UtgifterPerBarn } from '../utils';

export const validerInnvilgetVedtakForm = ({
    stønadsperioder,
    utgifterPerBarn,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            stønadsperioder,
            utgifterPerBarn,
        }),
    };
};

export const validerPerioder = ({
    stønadsperioder,
    utgifterPerBarn,
}: {
    stønadsperioder: Stønadsperiode[];
    utgifterPerBarn: UtgifterPerBarn[];
}): FormErrors<{
    stønadsperioder: Stønadsperiode[];
    utgifterPerBarn: UtgifterPerBarn[];
}> => {
    return {
        ...validerStønadsperioder(stønadsperioder),
        ...validerUtgifter(utgifterPerBarn),
    };
};

const validerStønadsperioder = (
    stønadsperioder: Stønadsperiode[]
): FormErrors<{
    stønadsperioder: Stønadsperiode[];
}> => {
    const feilIStønadsperioder = stønadsperioder.map((periode) => {
        const stønadsperiodeFeil: FormErrors<Stønadsperiode> = {
            fom: undefined,
            tom: undefined,
        };

        if (!periode.fom) {
            return { ...stønadsperiodeFeil, fom: 'Mangler fradato for periode' };
        }

        if (!periode.tom) {
            return { ...stønadsperiodeFeil, tom: 'Mangler tildato for periode' };
        }

        if (!erDatoEtterEllerLik(periode.tom, periode.fom)) {
            return {
                ...stønadsperiodeFeil,
                tom: 'Sluttdato (til) må være etter startdato (fra) for periode',
            };
        }

        return stønadsperiodeFeil;
    });

    return {
        stønadsperioder: feilIStønadsperioder,
    };
};

const validerUtgifter = (
    utgifterPerBarn: UtgifterPerBarn[]
): FormErrors<{
    utgifterPerBarn: UtgifterPerBarn[];
}> => {
    const feilIUtgifter: FormErrors<UtgifterPerBarn>[] = utgifterPerBarn.map((u) => ({
        barnId: undefined,
        utgifter: u.utgifter.map((utgift) => {
            const utgiftFeil: FormErrors<Utgift> = {
                fom: undefined,
                tom: undefined,
                utgift: undefined,
            };
            if (!utgift.fom) {
                return { ...utgiftFeil, fom: 'Mangler fradato for periode' };
            }

            if (!utgift.tom) {
                return { ...utgiftFeil, tom: 'Mangler tildato for periode' };
            }

            // TODO: Bytt ut validering av dato med noe som funker for årmåned
            // if (!erDatoEtterEllerLik(utgift.tom, utgift.fom)) {
            //     return {
            //         ...utgiftFeil,
            //         til: 'Sluttdato (til) må være etter startdato (fra) for periode',
            //     };
            // }

            if (!utgift.utgift) {
                return {
                    ...utgiftFeil,
                    utgift: 'Du må legge inn en månedlig utgift',
                };
            }

            if (utgift.utgift <= 0) {
                return {
                    ...utgiftFeil,
                    utgift: 'Månedlig utgift må være større enn 0kr',
                };
            }
            return utgiftFeil;
        }),
    }));

    return {
        utgifterPerBarn: feilIUtgifter,
    };
};
