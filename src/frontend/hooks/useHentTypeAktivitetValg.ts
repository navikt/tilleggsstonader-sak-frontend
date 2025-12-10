import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Kodeverk } from '../typer/kodeverk';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    typeAktivitetValg: Ressurs<Kodeverk[]>;
}

export const useHentTypeAktivitetValg = (): Response => {
    const { request } = useApp();

    const [typeAktivitetValg, settTypeAktivitetValg] =
        useState<Ressurs<Kodeverk[]>>(byggTomRessurs());

    useEffect(() => {
        settTypeAktivitetValg(byggHenterRessurs());

        request<Kodeverk[], null>(`/api/sak/vilkarperiode/aktivitet/type-aktivitet`).then(
            settTypeAktivitetValg
        );
    }, [request]);

    return {
        typeAktivitetValg,
    };
};
