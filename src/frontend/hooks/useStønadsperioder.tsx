import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Stønadsperiode } from '../Sider/Behandling/Inngangsvilkår/typer/stønadsperiode';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentStønadsperioder: (behandlingId: string) => void;
    stønadsperioder: Ressurs<Stønadsperiode[]>;
}
export const useStønadsperioder = (): Response => {
    const { request } = useApp();
    const [stønadsperioder, settStønadsperioder] =
        useState<Ressurs<Stønadsperiode[]>>(byggTomRessurs());

    const hentStønadsperioder = useCallback(
        (behandlingId: string) => {
            request<Stønadsperiode[], null>(`/api/sak/stonadsperiode/${behandlingId}`).then(
                settStønadsperioder
            );
        },
        [request]
    );

    return {
        hentStønadsperioder,
        stønadsperioder,
    };
};
