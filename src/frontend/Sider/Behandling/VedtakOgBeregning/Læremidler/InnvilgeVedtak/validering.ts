import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakLæremidler';
import { validerPeriode } from '../../../../../utils/periode';

export const validerVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[],
    lagredeVedstaksperioder: Map<string, Vedtaksperiode>,
    revurderesFraDato?: string
): FormErrors<Vedtaksperiode[]> =>
    vedtaksperioder.map((periode) => {
        const feil: FormErrors<Vedtaksperiode> = {
            id: undefined,
            fom: undefined,
            tom: undefined,
            målgruppeType: undefined,
            aktivitetType: undefined,
        };

        const lagretPeriode = lagredeVedstaksperioder.get(periode.id);

        const periodeValidering = validerPeriode(periode, lagretPeriode, revurderesFraDato);
        if (periodeValidering) {
            return {
                ...feil,
                ...periodeValidering,
            };
        }

        // TODO validering av målgruppe/aktivitet ?

        return feil;
    });
