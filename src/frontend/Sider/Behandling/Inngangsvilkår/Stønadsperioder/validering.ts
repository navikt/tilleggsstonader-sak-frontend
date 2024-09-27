import { finnStønadsperiodeIListe } from './utils';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { validerPeriode } from '../../../../utils/periode';
import { Stønadsperiode } from '../typer/stønadsperiode';

export const validerStønadsperioder = (
    stønadsperioder: Stønadsperiode[],
    lagredeStønadsperioder: Stønadsperiode[] | [],
    revurderesFraDato?: string
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

        const lagretPeriode = finnStønadsperiodeIListe(periode, lagredeStønadsperioder);

        const periodeValidering = validerPeriode(periode, lagretPeriode, revurderesFraDato);
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
