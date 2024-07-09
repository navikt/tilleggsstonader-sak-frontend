import { useState, useEffect } from 'react';
import { useKlageApp } from '../context/KlageAppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useParams } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { DokumentProps } from '../familie-felles-frontend/familie-dokumentliste';

export const useHentDokumenter = (): Ressurs<DokumentProps[]> => {
    const { autentisert, axiosRequest } = useKlageApp();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentProps[]>>(byggTomRessurs);

    const a = useApp();

    const autentisert2 = a.autentisert;
    const request = a.request;

    console.log('AUTENTISERT klage?');
    console.log(autentisert);

    console.log('AUTENTISERT itt-klage?');
    console.log(autentisert2);

    const { behandlingId } = useParams<{ behandlingId: string }>();

    const hentDokumenter = () => {
        settDokumenter({ status: RessursStatus.HENTER });
        axiosRequest<DokumentProps[], null>({
            method: 'GET',
            url: `/api/klage/vedlegg/${behandlingId}`,
        }).then(settDokumenter);
    };

    useEffect(() => {
        hentDokumenter();
        return () => {
            settDokumenter(byggTomRessurs);
        };
    }, [behandlingId]);

    return dokumenter;
};
