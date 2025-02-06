import { v4 as uuidv4 } from 'uuid';

import { Vedtaksperiode } from './InnvilgeVedtak/InnvilgeLæremidler';

export const initialiserVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[] | undefined
): Vedtaksperiode[] => {
    return vedtaksperioder ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): Vedtaksperiode => ({
    fom: '',
    tom: '',
    id: uuidv4(),
});
