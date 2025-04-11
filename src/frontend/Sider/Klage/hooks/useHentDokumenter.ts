import { useEffect, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useKlagebehandling } from '../context/KlagebehandlingContext';
import { DokumentProps } from '../familie-felles-frontend/familie-dokumentliste';

export const useHentDokumenter = (): Ressurs<DokumentProps[]> => {
    const { request } = useApp();

    const { behandling } = useKlagebehandling();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentProps[]>>(byggTomRessurs);

    useEffect(() => {
        settDokumenter({ status: RessursStatus.HENTER });
        request<DokumentProps[], null>(`/api/klage/vedlegg/${behandling.id}`).then(settDokumenter);
    }, [request, behandling.id]);

    return dokumenter;
};
