import { useCallback, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { useApp } from '../context/AppContext';
import { Klagebehandlinger } from '../typer/klage';
import { byggRessursSuksess, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Toggle } from '../utils/toggles';

interface Response {
    hentKlagebehandlinger: (fagsakPersonId: string) => void;
    klagebehandlinger: Ressurs<Klagebehandlinger>;
}

export const useHentKlagebehandlinger = (): Response => {
    const { request } = useApp();

    const [klagebehandlinger, settKlagebehandlinger] =
        useState<Ressurs<Klagebehandlinger>>(byggTomRessurs());

    const kanOppretteKlage = useFlag(Toggle.KAN_OPPRETTE_KLAGE);

    const hentKlagebehandlinger = useCallback(
        (fagsakPersonId: string) => {
            // TODO: Fjern prodsjekk når klage-backend er oppe å gå i prod
            if (!kanOppretteKlage) {
                const midlertidigMocketKlagebehandling: Klagebehandlinger = { barnetilsyn: [] };
                settKlagebehandlinger(byggRessursSuksess(midlertidigMocketKlagebehandling));
            } else {
                request<Klagebehandlinger, null>(
                    `/api/sak/klage/fagsak-person/${fagsakPersonId}`
                ).then(settKlagebehandlinger);
            }
        },
        [request, kanOppretteKlage]
    );

    return {
        hentKlagebehandlinger,
        klagebehandlinger,
    };
};
