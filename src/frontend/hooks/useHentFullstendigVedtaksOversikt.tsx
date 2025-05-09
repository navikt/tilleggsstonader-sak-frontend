import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { VedtakperioderOversiktResponse } from '../typer/vedtak/vedtaksperiodeOppsummering';

export const useHentFullstendigVedtaksOversikt = (
    fagsakPersonId: string
): { vedtaksperioderOversikt: Ressurs<VedtakperioderOversiktResponse> } => {
    const { request } = useApp();

    const [vedtakOversiktResponse, setVedtakOversiktResponse] =
        useState<Ressurs<VedtakperioderOversiktResponse>>(byggTomRessurs());

    useEffect(() => {
        request<VedtakperioderOversiktResponse, null>(
            `/api/sak/vedtak/fullstendig-oversikt/${fagsakPersonId}`
        ).then(setVedtakOversiktResponse);
    }, [request, fagsakPersonId]);

    return { vedtaksperioderOversikt: vedtakOversiktResponse };
};
