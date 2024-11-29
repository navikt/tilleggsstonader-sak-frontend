import { useCallback, useEffect, useState } from 'react';

import { MellomlagretBrevDto } from './mellomlagring';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../typer/ressurs';

const useMellomlagringBrev = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [mellomlagretBrev, settMellomlagretBrev] =
        useState<Ressurs<MellomlagretBrevDto>>(byggTomRessurs());

    const hentMellomlagretBrev = useCallback(() => {
        settMellomlagretBrev(byggHenterRessurs());
        request<MellomlagretBrevDto, unknown>(`/api/sak/brev/mellomlager/${behandling.id}`).then(
            settMellomlagretBrev
        );
    }, [request, behandling]);

    useEffect(hentMellomlagretBrev, [hentMellomlagretBrev]);

    return { mellomlagretBrev };
};

export default useMellomlagringBrev;
