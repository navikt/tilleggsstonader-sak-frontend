import { v4 as uuidv4 } from 'uuid';

import { Vedtaksperiode } from '../../../../typer/vedtak/vedtakLæremidler';
import { VedtaksperiodeTilsynBarn } from '../../../../typer/vedtak/vedtakTilsynBarn';

export const initialiserVedtaksperioder = (
    vedtaksperioder: VedtaksperiodeTilsynBarn[] | undefined
): Vedtaksperiode[] => {
    return vedtaksperioder ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): VedtaksperiodeTilsynBarn => ({
    fom: '',
    tom: '',
    id: uuidv4(),
});
