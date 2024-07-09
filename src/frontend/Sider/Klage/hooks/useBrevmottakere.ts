import { useCallback, useEffect, useState } from 'react';
import { IBrevmottakere } from '../Steg/Brev/Brevmottakere/typer';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useKlageApp } from '../context/KlageAppContext';

export const useBrevmottakere = (behandlingId: string) => {
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<IBrevmottakere>>(byggTomRessurs());
    const { axiosRequest } = useKlageApp();

    const hentBrevmottakere = () => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/api/klage/brev/${behandlingId}/mottakere`,
        };
        axiosRequest<IBrevmottakere, null>(behandlingConfig).then((res: Ressurs<IBrevmottakere>) =>
            settBrevmottakere(res)
        );
    };

    useEffect(() => {
        hentBrevmottakere()
    }, [behandlingId]);

    return { brevmottakere, hentBrevmottakere };
};
