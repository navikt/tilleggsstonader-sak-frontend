import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Kodeverk } from '../typer/kodeverk';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    tiltaksvariantValg: Ressurs<Kodeverk[]>;
}

export const useHentTiltaksvariantValg = (): Response => {
    const { request } = useApp();

    const [tiltaksvariantValg, settTiltaksvariantValg] =
        useState<Ressurs<Kodeverk[]>>(byggTomRessurs());

    useEffect(() => {
        settTiltaksvariantValg(byggHenterRessurs());

        request<Kodeverk[], null>(`/api/sak/vilkarperiode/aktivitet/tiltaksvarianter`).then(
            settTiltaksvariantValg
        );
    }, [request]);

    return {
        tiltaksvariantValg,
    };
};
