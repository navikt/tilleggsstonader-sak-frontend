import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakLæremidler';
import { Periode, validerPeriode } from '../../../../../utils/periode';

export const validerVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[],
    lagredeVedstaksperioder: Map<string, Vedtaksperiode>,
    revurderesFraDato?: string
): FormErrors<Periode[]> =>
    vedtaksperioder.map((periode) => {
        const feil: FormErrors<Periode> = {
            fom: undefined,
            tom: undefined,
        };

        const lagretPeriode = lagredeVedstaksperioder.get(periode.id);

        const periodeValidering = validerPeriode(periode, lagretPeriode, revurderesFraDato);
        if (periodeValidering) {
            return {
                ...feil,
                ...periodeValidering,
            };
        }

        return feil;
    });
