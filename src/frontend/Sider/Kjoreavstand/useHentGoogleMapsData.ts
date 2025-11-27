import { useCallback, useState } from 'react';

import { ForslagRequest } from './ForslagRequest';
import { ForslagResponse } from './ForslagResponse';
import { Reiserute } from './Reisedata';
import { ReisedataRequest } from './ReisedataRequest';
import { StatiskKartRequest } from './StatiskKartRequest';
import { useApp } from '../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../typer/ressurs';

export const useHentGoogleMapsData = () => {
    const { request } = useApp();

    const [kjøreavstandResponse, setKjøreavstandResponse] =
        useState<Ressurs<Reiserute>>(byggTomRessurs());

    const [kollektivDetaljerResponse, setKollektivDetaljerResponse] =
        useState<Ressurs<Reiserute>>(byggTomRessurs());

    const [statiskKart, setStatiskKart] = useState<string>();

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

    const hentStatiskKart = useCallback((statiskKartRequest: StatiskKartRequest) => {
        fetch('api/sak/kart/statisk-kart', {
            method: 'POST',
            body: JSON.stringify(statiskKartRequest),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.blob())
            .then((blob) => setStatiskKart(URL.createObjectURL(blob)));
    }, []);

    const resetGoogleMapsData = () => setKjøreavstandResponse(byggTomRessurs());

    const hentAdresseForslag = useCallback(
        async (input: string) => {
            if (input === '') {
                return [];
            }
            const res = await request<ForslagResponse, ForslagRequest>(
                `/api/sak/kart/autocomplete`,
                'POST',
                {
                    input: input,
                }
            );
            if (res.status === RessursStatus.SUKSESS) {
                if (res.data.forslag === null) {
                    return [];
                }
                return res.data.forslag;
            }
            return [];
        },
        [request]
    );

    return {
        hentKjøreavstand,
        hentKollektivDetaljer,
        resetGoogleMapsData,
        hentStatiskKart,
        hentAdresseForslag,
        kjøreavstandResponse,
        kollektivDetaljerResponse,
        statiskKart,
    };
};
