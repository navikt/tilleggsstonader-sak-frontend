import { v4 as uuidv4 } from 'uuid';

import { VedtaksperiodeBoutgifter } from '../../../../typer/vedtak/vedtakBoutgifter';
import { Vedtaksperiode } from '../../../../typer/vedtak/vedtakLæremidler';

export const initialiserVedtaksperioder = (
    vedtaksperioder: VedtaksperiodeBoutgifter[] | undefined
): Vedtaksperiode[] => {
    return vedtaksperioder ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): VedtaksperiodeBoutgifter => ({
    fom: '',
    tom: '',
    id: uuidv4(),
});
