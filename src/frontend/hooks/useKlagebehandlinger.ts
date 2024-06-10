import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Klagebehandlinger } from '../typer/klage';
import { byggRessursSuksess, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { erProd } from '../utils/miljø';

interface Response {
    hentKlagebehandlinger: (fagsakPersonId: string) => void;
    klagebehandlinger: Ressurs<Klagebehandlinger>;
}

export const useHentKlagebehandlinger = (): Response => {
    const { request } = useApp();

    const [klagebehandlinger, settKlagebehandlinger] =
        useState<Ressurs<Klagebehandlinger>>(byggTomRessurs());

    const hentKlagebehandlinger = useCallback(
        (fagsakPersonId: string) => {
            // TODO: Fjern prodsjekk når klage-backend er oppe å gå i prod
            if (erProd()) {
                const midlertidigMocketKlagebehandling: Klagebehandlinger = { barnetilsyn: [] };
                settKlagebehandlinger(byggRessursSuksess(midlertidigMocketKlagebehandling));
            } else {
                request<Klagebehandlinger, null>(
                    `/api/sak/klage/fagsak-person/${fagsakPersonId}`
                ).then(settKlagebehandlinger);
            }
        },
        [request]
    );

    return {
        hentKlagebehandlinger,
        klagebehandlinger,
    };
};
