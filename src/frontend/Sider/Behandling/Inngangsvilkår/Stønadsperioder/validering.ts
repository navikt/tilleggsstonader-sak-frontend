import { FormErrors } from '../../../../hooks/felles/useFormState';
import { validerPeriode } from '../../../../utils/periode';
import { Stønadsperiode } from '../typer/stønadsperiode';

export const validerStønadsperioder = (
    stønadsperioder: Stønadsperiode[]
): FormErrors<Stønadsperiode[]> => {
    const feilIStønadsperioder = stønadsperioder.map((periode) => {
        const stønadsperiodeFeil: FormErrors<Stønadsperiode> = {
            målgruppe: undefined,
            aktivitet: undefined,
            fom: undefined,
            tom: undefined,
        };

        if (!periode.målgruppe) {
            return { ...stønadsperiodeFeil, målgruppe: 'Mangler målgruppe for periode' };
        }

        if (!periode.aktivitet) {
            return { ...stønadsperiodeFeil, aktivitet: 'Mangler aktivitet for periode' };
        }

        const periodeValidering = validerPeriode(periode);
        if (periodeValidering) {
            return {
                ...stønadsperiodeFeil,
                ...periodeValidering,
            };
        }

        return stønadsperiodeFeil;
    });

    return feilIStønadsperioder;
};
