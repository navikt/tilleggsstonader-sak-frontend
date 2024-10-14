import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Klagebehandlinger } from '../typer/klage';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

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
            request<Klagebehandlinger, null>(`/api/sak/klage/fagsak-person/${fagsakPersonId}`).then(
                settKlagebehandlinger
            );
        },
        [request]
    );

    return {
        hentKlagebehandlinger,
        klagebehandlinger,
    };
};
