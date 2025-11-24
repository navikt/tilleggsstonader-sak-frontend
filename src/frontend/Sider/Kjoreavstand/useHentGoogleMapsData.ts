import { useCallback, useState } from 'react';

import { Reiserute } from './Reisedata';
import { ReiseAdresse, ReisedataRequest } from './ReisedataRequest';
import { useApp } from '../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

export const useHentGoogleMapsData = () => {
    const { request } = useApp();

    const [kjøreavstandResponse, setKjøreavstandResponse] =
        useState<Ressurs<Reiserute>>(byggTomRessurs());

    const [kollektivDetaljerResponse, setKollektivDetaljerResponse] =
        useState<Ressurs<Reiserute>>(byggTomRessurs());

    const [statiskKart, setStatiskKart] = useState<string>();

    const hentKjøreavstand = useCallback(
        (fra: ReiseAdresse, til: ReiseAdresse) => {
            request<Reiserute, ReisedataRequest>(`/api/sak/kart/kjoreavstand`, 'POST', {
                fraAdresse: fra,
                tilAdresse: til,
            }).then(setKjøreavstandResponse);
        },
        [request]
    );

    const hentKollektivDetaljer = useCallback(
        (fra: ReiseAdresse, til: ReiseAdresse) => {
            request<Reiserute, ReisedataRequest>(`/api/sak/kart/kollektiv-detaljer`, 'POST', {
                fraAdresse: fra,
                tilAdresse: til,
            }).then(setKollektivDetaljerResponse);
        },
        [request]
    );

    const hentStatiskKart = (polyline: string) => {
        fetch('api/sak/kart/statisk-kart', {
            method: 'POST',
            body: JSON.stringify({ polyline: polyline }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.blob())
            .then((blob) => setStatiskKart(URL.createObjectURL(blob)));
    };

    const resetGoogleMapsData = () => setKjøreavstandResponse(byggTomRessurs());

    return {
        hentKjøreavstand,
        hentKollektivDetaljer,
        resetGoogleMapsData,
        hentStatiskKart,
        kjøreavstandResponse,
        kollektivDetaljerResponse,
        statiskKart,
    };
};
