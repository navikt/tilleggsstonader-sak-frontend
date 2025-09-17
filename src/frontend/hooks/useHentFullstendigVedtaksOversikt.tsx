import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { stønadstypeTilVedtakUrl } from '../Sider/Behandling/VedtakOgBeregning/Felles/stønadstypeTilVedtakUrl';
import { ArenaSakOgVedtak } from '../Sider/Personoversikt/Vedtaksperioderoversikt/Arena/vedtakArena';
import { Behandling } from '../typer/behandling/behandling';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import {
    DetaljertVedtaksperiodeBoutgifter,
    DetaljertVedtaksperiodeDagligReiseTso,
    DetaljertVedtaksperiodeDagligReiseTsr,
    DetaljertVedtaksperiodeLæremidler,
    DetaljertVedtaksperiodeTilsynBarn,
    VedtakperioderOversiktResponse,
} from '../typer/vedtak/vedtaksperiodeOppsummering';

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

type Stønadstype =
    | 'TILSYN_BARN'
    | 'LÆREMIDLER'
    | 'BOUTGIFTER'
    | 'DAGLIG_REISE_TSO'
    | 'DAGLIG_REISE_TSR';

type VedtaksOversiktMapping = {
    TILSYN_BARN: DetaljertVedtaksperiodeTilsynBarn[];
    LÆREMIDLER: DetaljertVedtaksperiodeLæremidler[];
    BOUTGIFTER: DetaljertVedtaksperiodeBoutgifter[];
    DAGLIG_REISE_TSO: DetaljertVedtaksperiodeDagligReiseTso[];
    DAGLIG_REISE_TSR: DetaljertVedtaksperiodeDagligReiseTsr[];
};
export const useHentFullstendigVedtaksOversiktForStønad = <T extends Stønadstype>(
    behandling: Behandling
): {
    hentetTidspunkt: Date | undefined;
    vedtaksperioderOversiktForStønad: Ressurs<VedtaksOversiktMapping[T]>;
} => {
    const { request } = useApp();

    const [vedtakOversiktResponseForStønad, settVedtakOversiktResponseForStønad] =
        useState<Ressurs<VedtaksOversiktMapping[T]>>(byggTomRessurs());

    const [hentetTidspunkt, settHentetTidspunkt] = useState<Date | undefined>();

    useEffect(() => {
        settVedtakOversiktResponseForStønad(byggHenterRessurs());
        request<VedtaksOversiktMapping[T], null>(
            `/api/sak/vedtak/${stønadstypeTilVedtakUrl[behandling.stønadstype]}/oversikt/${behandling.fagsakId}`
        ).then((res) => {
            settVedtakOversiktResponseForStønad(res);
            settHentetTidspunkt(new Date());
        });
    }, [request, behandling]);

    return {
        hentetTidspunkt: hentetTidspunkt,
        vedtaksperioderOversiktForStønad: vedtakOversiktResponseForStønad,
    };
};
