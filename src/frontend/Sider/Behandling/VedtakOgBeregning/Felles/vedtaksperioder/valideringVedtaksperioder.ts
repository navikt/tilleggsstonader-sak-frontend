import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { validerPeriode } from '../../../../../utils/periode';

export const validerVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[]
): FormErrors<Vedtaksperiode[]> =>
    vedtaksperioder.map((vedtaksperiode) => {
        const feil: FormErrors<Vedtaksperiode> = {
            id: undefined,
            fom: undefined,
            tom: undefined,
            målgruppeType: undefined,
            aktivitetType: undefined,
        };

        if (!vedtaksperiode.aktivitetType) {
            return { ...feil, aktivitetType: 'Mangler aktivitet for periode' };
        }

        if (!vedtaksperiode.målgruppeType) {
            return { ...feil, målgruppeType: 'Mangler målgruppe for periode' };
        }

        const periodeValidering = validerPeriode(vedtaksperiode);
        if (periodeValidering) {
            return {
                ...feil,
                ...periodeValidering,
            };
        }

        return feil;
    });
