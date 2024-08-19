import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { DokumentProps } from '../familie-felles-frontend/familie-dokumentliste';

export const useHentDokumenter = (): Ressurs<DokumentProps[]> => {
    const { request } = useApp();

    const { behandlingId } = useParams<{ behandlingId: string }>();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentProps[]>>(byggTomRessurs);

    useEffect(() => {
        settDokumenter({ status: RessursStatus.HENTER });
        request<DokumentProps[], null>(`/api/klage/vedlegg/${behandlingId}`).then(settDokumenter);
    }, [behandlingId, request]);

    return dokumenter;
};
