import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Utgift } from '../../../../../typer/vedtak';

export const validerInnvilgetVedtakForm = ({
    utgifter,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            utgifter,
        }),
    };
};

export const validerPerioder = ({
    utgifter,
}: {
    utgifter: Record<string, Utgift[]>;
}): FormErrors<{
    utgifter: Record<string, Utgift[]>;
}> => {
    return {
        ...validerUtgifter(utgifter),
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
                const utgiftFeil: FormErrors<Utgift> = {
                    fom: undefined,
                    tom: undefined,
                    utgift: undefined,
                };

                // TODO: Tilpass validering
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
            }),
        };
    }, {});

    return {
        utgifter: feilIUtgifter,
    };
};
