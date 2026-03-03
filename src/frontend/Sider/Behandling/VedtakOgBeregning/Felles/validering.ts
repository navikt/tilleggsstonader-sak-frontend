import { ÅrsakAvslag, ÅrsakOpphør } from '../../../../typer/vedtak/vedtak';
import { harIkkeVerdi } from '../../../../utils/utils';

export interface FeilmeldingVedtak {
    årsaker?: string;
    begrunnelse?: string;
    opphørsdato?: string;
}

export const validerOpphør = (
    årsaker: ÅrsakOpphør[],
    begrunnelse?: string | undefined,
    opphørsdato?: string | undefined
): FeilmeldingVedtak => {
    const feilmeldinger: FeilmeldingVedtak = {};

    if (årsaker.length === 0) {
        feilmeldinger.årsaker = 'Minst en årsak må velges';
    }

    if (harIkkeVerdi(begrunnelse)) {
        feilmeldinger.begrunnelse = 'Begrunnelse må fylles ut';
    }
    if (!opphørsdato) {
        feilmeldinger.opphørsdato = 'Opphørsdato må fylles ut';
    }

    return feilmeldinger;
};

export const validerAvslag = (
    årsaker: ÅrsakAvslag[],
    begrunnelse?: string | undefined
): FeilmeldingVedtak => {
    const feilmeldinger: FeilmeldingVedtak = {};

    if (årsaker.length === 0) {
        feilmeldinger.årsaker = 'Minst en årsak må velges';
    }

    const årsakerSomKreverBegrunnelse = [ÅrsakAvslag.ANNET, ÅrsakAvslag.RETT_TIL_UTSTYRSSTIPEND];
    const trengerBegrunnelse = årsaker.some((a) => årsakerSomKreverBegrunnelse.includes(a));

    if (trengerBegrunnelse && harIkkeVerdi(begrunnelse)) {
        feilmeldinger.begrunnelse = 'Begrunnelse må fylles ut';
    }
    return feilmeldinger;
};
