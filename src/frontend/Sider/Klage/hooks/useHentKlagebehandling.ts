import { useCallback, useState } from 'react';
import { Klagebehandling } from '../typer/klagebehandling/klagebehandling';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';

export const useHentKlagebehandling = (
    behandlingId: string
): {
    hentBehandlingCallback: () => void;
    behandling: Ressurs<Klagebehandling>;
} => {
    const { request } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Klagebehandling>>(byggTomRessurs());

    const hentBehandlingCallback = useCallback(() => {
        request<Klagebehandling, null>(`/api/klage/behandling/${behandlingId}`).then(settBehandling);
    }, [request, behandlingId]);

    return {
        hentBehandlingCallback,
        behandling,
    };
};
