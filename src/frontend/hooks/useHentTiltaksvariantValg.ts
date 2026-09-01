import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { Kodeverk } from '../typer/kodeverk';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    tiltaksvariantValg: Ressurs<Kodeverk[]>;
}

export const useHentTiltaksvariantValg = (stønadstype: Stønadstype): Response => {
    const { request } = useApp();

    const [tiltaksvariantValg, settTiltaksvariantValg] =
        useState<Ressurs<Kodeverk[]>>(byggTomRessurs());

    useEffect(() => {
        settTiltaksvariantValg(byggHenterRessurs());

        request<Kodeverk[], null>(
            `/api/sak/vilkarperiode/aktivitet/tiltaksvarianter?stønadstype=${stønadstype}`
        ).then(settTiltaksvariantValg);
    }, [request, stønadstype]);

    return {
        tiltaksvariantValg,
    };
};
