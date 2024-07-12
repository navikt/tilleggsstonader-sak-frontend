import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { IBrevmottakere } from '../komponenter/Brevmottakere/typer';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

export const useBrevmottakere = (behandlingId: string) => {
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<IBrevmottakere>>(byggTomRessurs());
    const { request } = useApp();

    const hentBrevmottakere = () => {
        request<IBrevmottakere, null>(`/api/klage/brev/${behandlingId}/mottakere`).then(
            settBrevmottakere
        );
    };

    useEffect(() => {
        hentBrevmottakere();
    }, [behandlingId]);

    return { brevmottakere, hentBrevmottakere };
};
