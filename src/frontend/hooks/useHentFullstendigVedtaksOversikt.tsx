import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { ArenaSakOgVedtak } from '../Sider/Personoversikt/Behandlingsoversikt/Arena/vedtakArena';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { VedtakperioderOversiktResponse } from '../typer/vedtak/vedtaksperiodeOppsummering';

export const useHentFullstendigVedtaksOversikt = (
    fagsakPersonId: string
): { vedtaksperioderOversikt: Ressurs<VedtakperioderOversiktResponse> } => {
    const { request } = useApp();

    const [vedtakOversiktResponse, settVedtakOversiktResponse] =
        useState<Ressurs<VedtakperioderOversiktResponse>>(byggTomRessurs());

    useEffect(() => {
        settVedtakOversiktResponse(byggHenterRessurs());
        request<VedtakperioderOversiktResponse, null>(
            `/api/sak/vedtak/fullstendig-oversikt/${fagsakPersonId}`
        ).then(settVedtakOversiktResponse);
    }, [request, fagsakPersonId]);

    return { vedtaksperioderOversikt: vedtakOversiktResponse };
};

export const useVedtaksperioderOversiktArena = (
    fagsakPersonId: string
): { arenaSakOgVedtak: Ressurs<ArenaSakOgVedtak> } => {
    const { request } = useApp();

    const [vedtakArena, settVedtakArena] = useState<Ressurs<ArenaSakOgVedtak>>(byggTomRessurs());

    useEffect(() => {
        settVedtakArena(byggHenterRessurs());
        request<ArenaSakOgVedtak, null>(`/api/sak/arena/vedtak/${fagsakPersonId}`).then(
            settVedtakArena
        );
    }, [request, fagsakPersonId]);

    return { arenaSakOgVedtak: vedtakArena };
};
