import { useCallback, useState } from 'react';

import { Reiserute } from './Reisedata';
import { ReisedataRequest } from './ReisedataRequest';
import { useApp } from '../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

export const useHentGoogleMapsData = () => {
    const { request } = useApp();

    const [kjøreavstandResponse, setKjøreavstandResponse] =
        useState<Ressurs<Reiserute>>(byggTomRessurs());

    const [kollektivDetaljerResponse, setKollektivDetaljerResponse] =
        useState<Ressurs<Reiserute>>(byggTomRessurs());

    const hentKjøreavstand = useCallback(
        (fra: string, til: string) => {
            request<Reiserute, ReisedataRequest>(`/api/sak/kart/kjoreavstand`, 'POST', {
                fraAdresse: fra,
                tilAdresse: til,
            }).then(setKjøreavstandResponse);
        },
        [request]
    );

    const hentKollektivDetaljer = useCallback(
        (fra: string, til: string) => {
            request<Reiserute, ReisedataRequest>(`/api/sak/kart/kollektiv-detaljer`, 'POST', {
                fraAdresse: fra,
                tilAdresse: til,
            }).then(setKollektivDetaljerResponse);
        },
        [request]
    );

    const resetGoogleMapsData = () => setKjøreavstandResponse(byggTomRessurs());

    return {
        hentKjøreavstand,
        hentKollektivDetaljer,
        resetGoogleMapsData,
        kjøreavstandResponse,
        kollektivDetaljerResponse,
    };
};
