import { useCallback, useState } from 'react';

import { KjøreavstandRequest, ReiseAdresse } from './KjøreavstandRequest';
import { Reisedata } from './Reisedata';
import { useApp } from '../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

export const useHentGoogleMapsData = () => {
    const { request } = useApp();

    const [kjøreavstandResponse, setKjøreavstandResponse] =
        useState<Ressurs<Reisedata>>(byggTomRessurs());

    const [kollektivDetaljerResponse, setKollektivDetaljerResponse] =
        useState<Ressurs<Reisedata>>(byggTomRessurs());

    const hentKjøreavstand = useCallback(
        (fra: ReiseAdresse, til: ReiseAdresse) => {
            request<Reisedata, KjøreavstandRequest>(`/api/sak/kart/kjoreavstand`, 'POST', {
                fraAdresse: fra,
                tilAdresse: til,
            }).then(setKjøreavstandResponse);
        },
        [request]
    );

    const hentKollektivDetaljer = useCallback(
        (fra: ReiseAdresse, til: ReiseAdresse) => {
            request<Reisedata, KjøreavstandRequest>(`/api/sak/kart/kollektiv-detaljer`, 'POST', {
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
