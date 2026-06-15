import constate from 'constate';

import { VedtakDagligReise } from '../typer/vedtak/vedtakDagligReise';

interface KjørelisteContextType {
    vedtak: VedtakDagligReise;
}

export const [KjørelisteProvider, useKjørelisteContext] = constate(
    ({ vedtak }: KjørelisteContextType) => ({ vedtak })
);
