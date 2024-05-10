import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Stønadsperiode } from '../Sider/Behandling/Inngangsvilkår/typer/stønadsperiode';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    stønadsperioder: Ressurs<Stønadsperiode[]>;
}
export const useStønadsperioder = (behandlingId: string): Response => {
    const { request } = useApp();
    const [stønadsperioder, settStønadsperioder] =
        useState<Ressurs<Stønadsperiode[]>>(byggTomRessurs());

    useEffect(() => {
        request<Stønadsperiode[], null>(`/api/sak/stonadsperiode/${behandlingId}`).then(
            settStønadsperioder
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandlingId]);

    return {
        stønadsperioder,
    };
};
