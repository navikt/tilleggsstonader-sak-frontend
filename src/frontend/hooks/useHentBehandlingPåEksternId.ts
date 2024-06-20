import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { KlageBehandling } from '../typer/behandling/klageBehandling';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Props {
    hentBehandlingPåEksternId: (eksternId: string) => void;
    behandling: Ressurs<KlageBehandling>;
}

export const useHentBehandlingPåEksternId = (): Props => {
    const { request } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<KlageBehandling>>(byggTomRessurs());

    const hentBehandlingPåEksternId = useCallback(
        (eksternBehandlingId: string) => {
            request<KlageBehandling, string>(
                `/api/sak/behandling/ekstern${eksternBehandlingId}`
            ).then(settBehandling);
        },
        [request]
    );

    return {
        hentBehandlingPåEksternId,
        behandling,
    };
};
