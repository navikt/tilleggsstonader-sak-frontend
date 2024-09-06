import { useCallback, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { Ressurs, byggRessursSuksess, byggTomRessurs } from '../../../typer/ressurs';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { erBehandlingRedigerbar, Klagebehandling } from '../typer/klagebehandling/klagebehandling';

export const useHentFagsystemVedtak = (): {
    hentFagsystemVedtak: (behandling: Klagebehandling) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { request } = useApp();

    const [fagsystemVedtak, settFagsystemVedtak] =
        useState<Ressurs<FagsystemVedtak[]>>(byggTomRessurs);

    const hentFagsystemVedtak = useCallback(
        (behandling: Klagebehandling) => {
            if (erBehandlingRedigerbar(behandling)) {
                request<FagsystemVedtak[], null>(
                    `/api/klage/behandling/${behandling.id}/fagsystem-vedtak`
                ).then(settFagsystemVedtak);
            } else {
                const fagsystemVedtak = behandling.påklagetVedtak.fagsystemVedtak;
                settFagsystemVedtak(byggRessursSuksess(fagsystemVedtak ? [fagsystemVedtak] : []));
            }
        },
        [request]
    );

    return {
        hentFagsystemVedtak,
        fagsystemVedtak,
    };
};
