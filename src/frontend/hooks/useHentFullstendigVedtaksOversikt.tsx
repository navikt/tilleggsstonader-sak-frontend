import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { ArenaSakOgVedtak } from '../Sider/Personoversikt/Vedtaksperioderoversikt/Arena/vedtakArena';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { VedtakperioderOversiktResponse } from '../typer/vedtak/vedtaksperiodeOppsummering';

export const useHentFullstendigVedtaksOversikt = (
    fagsakPersonId: string
): {
    hentetTidspunkt: Date | undefined;
    vedtaksperioderOversikt: Ressurs<VedtakperioderOversiktResponse>;
} => {
    const { request } = useApp();

    const [vedtakOversiktResponse, settVedtakOversiktResponse] =
        useState<Ressurs<VedtakperioderOversiktResponse>>(byggTomRessurs());

    const [hentetTidspunkt, settHentetTidspunkt] = useState<Date | undefined>();

    useEffect(() => {
        settVedtakOversiktResponse(byggHenterRessurs());
        request<VedtakperioderOversiktResponse, null>(
            `/api/sak/vedtak/fullstendig-oversikt/${fagsakPersonId}`
        ).then((res) => {
            settVedtakOversiktResponse(res);
            settHentetTidspunkt(new Date());
        });
    }, [request, fagsakPersonId]);

    return { hentetTidspunkt: hentetTidspunkt, vedtaksperioderOversikt: vedtakOversiktResponse };
};

export const useVedtaksperioderOversiktArena = (
    fagsakPersonId: string
): { arenaSakOgVedtak: Ressurs<ArenaSakOgVedtak>; hentetTidspunkt: Date | undefined } => {
    const { request } = useApp();

    const [vedtakArena, settVedtakArena] = useState<Ressurs<ArenaSakOgVedtak>>(byggTomRessurs());

    const [hentetTidspunkt, settHentetTidspunkt] = useState<Date | undefined>();

    useEffect(() => {
        settVedtakArena(byggHenterRessurs());
        request<ArenaSakOgVedtak, null>(`/api/sak/arena/vedtak/${fagsakPersonId}`).then((res) => {
            settVedtakArena(res);
            settHentetTidspunkt(new Date());
        });
    }, [request, fagsakPersonId]);

    return { arenaSakOgVedtak: vedtakArena, hentetTidspunkt: hentetTidspunkt };
};
