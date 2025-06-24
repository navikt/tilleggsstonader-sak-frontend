import { useCallback, useState } from 'react';

import { useParams } from 'react-router-dom';

import { RerrunnableEffect, useRerunnableEffect } from './useRerunnableEffect';
import { useApp } from '../context/AppContext';
import { SaksbehandlerDto } from '../typer/behandling/saksbehandlerDto';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface SaksbehandlerResponse {
    hentTilordnetSaksbehandler: RerrunnableEffect;
    tilordnetSaksbehandler: Ressurs<SaksbehandlerDto>;
}

export const UsehentTilordnetSaksbehandler = (): SaksbehandlerResponse => {
    const { request } = useApp();
    const [tilordnetSaksbehandler, settTilordnetSaksbehandler] =
        useState<Ressurs<SaksbehandlerDto>>(byggTomRessurs());

    const behandlingId = useParams<{
        behandlingId: string;
    }>().behandlingId as string;

    const hentTilordnetSaksbehandlerCallback = useCallback(() => {
        request<SaksbehandlerDto, null>(`/api/sak/saksbehandler/${behandlingId}`).then(
            settTilordnetSaksbehandler
        );
    }, [request, behandlingId]);

    const hentTilordnetSaksbehandler = useRerunnableEffect(hentTilordnetSaksbehandlerCallback, [
        request,
        behandlingId,
    ]);

    return {
        hentTilordnetSaksbehandler,
        tilordnetSaksbehandler,
    };
};
