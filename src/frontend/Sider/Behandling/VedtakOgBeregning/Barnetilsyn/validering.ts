import { ÅrsakAvslag, ÅrsakOpphør } from '../../../../typer/vedtak';
import { harIkkeVerdi } from '../../../../utils/utils';

export interface FeilmeldingAvslag {
    årsaker?: string;
    begrunnelse?: string;
}

export const valider = (
    årsaker: ÅrsakAvslag[] | ÅrsakOpphør[],
    begrunnelse?: string
): FeilmeldingAvslag => {
    const feilmeldinger: FeilmeldingAvslag = {};

    if (årsaker.length === 0) {
        feilmeldinger.årsaker = 'Minst en årsak må velges';
    }

    if (harIkkeVerdi(begrunnelse)) {
        feilmeldinger.begrunnelse = 'Begrunnelse må fylles ut';
    }

    return feilmeldinger;
};
