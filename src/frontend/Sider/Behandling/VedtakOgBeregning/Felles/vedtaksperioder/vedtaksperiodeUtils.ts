import { v4 as uuidv4 } from 'uuid';

import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export const initialiserVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[] | undefined
): Vedtaksperiode[] => {
    return vedtaksperioder?.length ? vedtaksperioder : [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): Vedtaksperiode => ({
    fom: '',
    tom: '',
    målgruppeType: '',
    aktivitetType: '',
    id: uuidv4(),
});
