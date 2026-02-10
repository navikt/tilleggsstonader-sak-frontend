import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { Kjøreliste } from '../typer/kjøreliste';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentKjørelister: () => void;
    kjørelister: Ressurs<Kjøreliste[]>;
}

export const useKjøreliste = (): Response => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [kjørelister, settKjørelister] = useState<Ressurs<Kjøreliste[]>>(byggTomRessurs());

    const hentKjørelister = useCallback(() => {
        request<Kjøreliste[], null>(`/api/sak/kjoreliste/${behandling.id}`).then(settKjørelister);
    }, [behandling, request]);

    useEffect(() => {
        hentKjørelister();
    }, [hentKjørelister]);

    return {
        hentKjørelister,
        kjørelister,
    };
};
