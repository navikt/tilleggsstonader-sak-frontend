import { ÅrsakAvslag, ÅrsakOpphør } from '../../../../typer/vedtak/vedtak';
import { harIkkeVerdi } from '../../../../utils/utils';

export interface FeilmeldingVedtak {
    årsaker?: string;
    begrunnelse?: string;
    opphørsdato?: string;
}

export const valider = (
    årsaker: ÅrsakAvslag[] | ÅrsakOpphør[],
    begrunnelse?: string,
    opphørsdato?: string | undefined,
    erOpphør: boolean = false
): FeilmeldingVedtak => {
    const feilmeldinger: FeilmeldingVedtak = {};

    if (årsaker.length === 0) {
        feilmeldinger.årsaker = 'Minst en årsak må velges';
    }

    if (harIkkeVerdi(begrunnelse)) {
        feilmeldinger.begrunnelse = 'Begrunnelse må fylles ut';
    }

    if (erOpphør && !opphørsdato) {
        feilmeldinger.opphørsdato = 'Opphørsdato må fylles ut';
    }

    return feilmeldinger;
};
