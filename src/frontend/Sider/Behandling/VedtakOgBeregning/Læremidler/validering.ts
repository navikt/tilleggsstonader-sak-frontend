import { Vedtaksperiode } from './InnvilgeVedtak/InnvilgeLæremidler';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { ÅrsakAvslag, ÅrsakOpphør } from '../../../../typer/vedtak/vedtak';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';

// TODO: Dette er pliss likt barnetilsyn - fikse?
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

export const validerVedtaksperioder = (vedtaksperioder: Vedtaksperiode[]) =>
    vedtaksperioder.map((periode) => validerPeriode(periode) as FormErrors<Periode>);
