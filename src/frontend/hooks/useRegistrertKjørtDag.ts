import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import {
    RegistrertKjørtUke,
    RegistrertKjørtUkePostRequest,
    RegistrertKjørtUkePutRequest,
} from '../typer/kjøreliste';
import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';

export const useRegistrertKjørtDag = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [registrertKjørtUker, settRegistrertKjørtUker] =
        useState<Ressurs<RegistrertKjørtUke[]>>(byggTomRessurs());

    const hentRegistrertKjørtDag = useCallback(() => {
        request<RegistrertKjørtUke[], null>(`/api/sak/registrert-kjort-dag/${behandling.id}`).then(
            settRegistrertKjørtUker
        );
    }, [behandling, request]);

    useEffect(() => {
        hentRegistrertKjørtDag();
    }, [hentRegistrertKjørtDag]);

    const oppdaterUkeIState = (oppdatertUke: RegistrertKjørtUke) => {
        settRegistrertKjørtUker((prev) => {
            if (prev.status !== RessursStatus.SUKSESS) return prev;
            const eksisterer = prev.data.some((u) => u.id === oppdatertUke.id);
            return {
                ...prev,
                data: eksisterer
                    ? prev.data.map((u) => (u.id === oppdatertUke.id ? oppdatertUke : u))
                    : [...prev.data, oppdatertUke],
            };
        });
    };

    const lagreUke = (req: RegistrertKjørtUkePostRequest) =>
        request<RegistrertKjørtUke, RegistrertKjørtUkePostRequest>(
            `/api/sak/registrert-kjort-dag/${behandling.id}`,
            'POST',
            req
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                oppdaterUkeIState(res.data);
            }
            return res;
        });

    const oppdaterUke = (ukeId: string, req: RegistrertKjørtUkePutRequest) =>
        request<RegistrertKjørtUke, RegistrertKjørtUkePutRequest>(
            `/api/sak/registrert-kjort-dag/${behandling.id}/${ukeId}`,
            'PUT',
            req
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                oppdaterUkeIState(res.data);
            }
            return res;
        });

    return { registrertKjørtUker, lagreUke, oppdaterUke };
};
