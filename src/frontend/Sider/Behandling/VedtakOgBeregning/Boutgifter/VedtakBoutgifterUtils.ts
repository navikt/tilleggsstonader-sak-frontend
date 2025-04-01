import { v4 as uuidv4 } from 'uuid';

import { VedtaksperiodeBoutgifter } from '../../../../typer/vedtak/vedtakBoutgifter';

export const initialiserVedtaksperioder = (
    vedtaksperioder: VedtaksperiodeBoutgifter[] | undefined
): VedtaksperiodeBoutgifter[] => {
    return vedtaksperioder ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): VedtaksperiodeBoutgifter => ({
    fom: '',
    tom: '',
    id: uuidv4(),
});
