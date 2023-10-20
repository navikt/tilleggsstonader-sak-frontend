import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Stønadsperiode, Utgift } from '../../../../../typer/vedtak';
import { erDatoEtterEllerLik } from '../../../../../utils/dato';

export const validerInnvilgetVedtakForm = ({
    stønadsperioder,
    utgifter,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            stønadsperioder,
            utgifter,
        }),
    };
};

const validerPerioder = ({
    stønadsperioder,
    utgifter,
}: {
    stønadsperioder: Stønadsperiode[];
    utgifter: Record<string, Utgift[]>;
}): FormErrors<{
    stønadsperioder: Stønadsperiode[];
    utgifter: Record<string, Utgift[]>;
}> => {
    return {
        ...validerStønadsperioder(stønadsperioder),
        ...validerUtgifter(utgifter),
    };
};

const validerStønadsperioder = (
    stønadsperioder: Stønadsperiode[]
): FormErrors<{
    stønadsperioder: Stønadsperiode[];
}> => {
    const feilIStønadsperioder = stønadsperioder.map((periode) => {
        const stønadsperiodeFeil: FormErrors<Stønadsperiode> = {
            fra: undefined,
            til: undefined,
        };

        if (!periode.fra) {
            return { ...stønadsperiodeFeil, fra: 'Mangler fradato for periode' };
        }

        if (!periode.til) {
            return { ...stønadsperiodeFeil, til: 'Mangler tildato for periode' };
        }

        if (!erDatoEtterEllerLik(periode.til, periode.fra)) {
            return {
                ...stønadsperiodeFeil,
                til: 'Sluttdato (til) må være etter startdato (fra) for periode',
            };
        }

        return stønadsperiodeFeil;
    });

    return {
        stønadsperioder: feilIStønadsperioder,
    };
};

const validerUtgifter = (
    utgifter: Record<string, Utgift[]>
): FormErrors<{
    utgifter: Record<string, Utgift[]>;
}> => {
    const feilIUtgifter = Object.entries(utgifter).reduce((acc, [barnId, utgifter]) => {
        return {
            ...acc,
            [barnId]: utgifter.map((utgift) => {
                const utgiftFeil = {
                    fra: undefined,
                    til: undefined,
                    utgift: undefined,
                };

                // TODO: Tilpass validering
                if (!utgift.fra) {
                    return { ...utgiftFeil, fra: 'Mangler fradato for periode' };
                }

                if (!utgift.til) {
                    return { ...utgiftFeil, til: 'Mangler tildato for periode' };
                }

                if (!erDatoEtterEllerLik(utgift.til, utgift.fra)) {
                    return {
                        ...utgiftFeil,
                        til: 'Sluttdato (til) må være etter startdato (fra) for periode',
                    };
                }

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
            }),
        };
    }, {});

    return {
        utgifter: feilIUtgifter,
    };
};
