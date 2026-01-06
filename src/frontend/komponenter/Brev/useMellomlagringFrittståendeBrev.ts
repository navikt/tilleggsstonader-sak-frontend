import { useCallback, useEffect, useState } from 'react';

import { MellomlagretBrevDto } from './mellomlagring';
import { useApp } from '../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

export const useMellomlagringFrittståendeBrev = (fagsakId: string) => {
    const { request } = useApp();

    const [mellomlagretBrev, settMellomlagretBrev] =
        useState<Ressurs<MellomlagretBrevDto>>(byggTomRessurs());

    const hentMellomlagretBrev = useCallback(() => {
        request<MellomlagretBrevDto, unknown>(`/api/sak/brev/mellomlager/fagsak/${fagsakId}`).then(
            settMellomlagretBrev
        );
    }, [request, fagsakId]);

    useEffect(hentMellomlagretBrev, [hentMellomlagretBrev]);

    return { mellomlagretBrev, settMellomlagretBrev };
};
