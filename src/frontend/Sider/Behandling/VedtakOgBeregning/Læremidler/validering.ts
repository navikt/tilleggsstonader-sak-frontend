import { vedtaksperiodeRecordTilListe } from './vedtakLæremidlerUtils';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { ÅrsakAvslag, ÅrsakOpphør } from '../../../../typer/vedtak/vedtak';
import { Periode, PeriodeMedEndretKey, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';

export interface FeilmeldingVedtak {
    årsaker?: string;
    begrunnelse?: string;
}

export const valider = (
    årsaker: ÅrsakAvslag[] | ÅrsakOpphør[],
    begrunnelse?: string
): FeilmeldingVedtak => {
    const feilmeldinger: FeilmeldingVedtak = {};

    if (årsaker.length === 0) {
        feilmeldinger.årsaker = 'Minst en årsak må velges';
    }

    if (harIkkeVerdi(begrunnelse)) {
        feilmeldinger.begrunnelse = 'Begrunnelse må fylles ut';
    }

    return feilmeldinger;
};

export const validerVedtaksperioder = (vedtaksperioder: { [k: string]: PeriodeMedEndretKey }) =>
    vedtaksperiodeRecordTilListe(vedtaksperioder).reduce<{ [k: string]: FormErrors<Periode> }>(
        (acc, periode) => {
            const feil = validerPeriode(periode);
            if (feil) {
                acc[periode.endretKey] = feil as FormErrors<Periode>;
            }
            return acc;
        },
        {}
    );
