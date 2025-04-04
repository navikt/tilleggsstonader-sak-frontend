import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Vilkårsoppsummering } from '../typer/vilkårsoppsummering';

interface Response {
    vilkårsoppsummering: Ressurs<Vilkårsoppsummering>;
}

export const useVilkårsoppsummering = (behandlingId: string): Response => {
    const { request } = useApp();
    const [vilkårsoppsummering, settVilkårsoppsummering] =
        useState<Ressurs<Vilkårsoppsummering>>(byggTomRessurs());

    useEffect(() => {
        settVilkårsoppsummering(byggHenterRessurs());

        request<Vilkårsoppsummering, null>(`/api/sak/vilkarsoppsummering/${behandlingId}`).then(
            settVilkårsoppsummering
        );
    }, [request, behandlingId]);

    return {
        vilkårsoppsummering,
    };
};
