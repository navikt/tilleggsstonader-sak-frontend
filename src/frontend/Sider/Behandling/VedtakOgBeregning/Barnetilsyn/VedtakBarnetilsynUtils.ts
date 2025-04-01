import { v4 as uuidv4 } from 'uuid';

import { VedtaksperiodeTilsynBarn } from '../../../../typer/vedtak/vedtakTilsynBarn';

export const initialiserVedtaksperioder = (
    vedtaksperioder: VedtaksperiodeTilsynBarn[] | undefined
): VedtaksperiodeTilsynBarn[] => {
    return vedtaksperioder ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): VedtaksperiodeTilsynBarn => ({
    fom: '',
    tom: '',
    id: uuidv4(),
});
