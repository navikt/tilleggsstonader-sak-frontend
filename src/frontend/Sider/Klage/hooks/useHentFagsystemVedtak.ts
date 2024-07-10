import { useCallback, useState } from 'react';
import { useKlageApp } from '../context/KlageAppContext';
import { erBehandlingRedigerbar, Klagebehandling } from '../typer/klagebehandling/klagebehandling';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { Ressurs, byggRessursSuksess, byggTomRessurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';

export const useHentFagsystemVedtak = (): {
    hentFagsystemVedtak: (behandling: Klagebehandling) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { axiosRequest } = useKlageApp();
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
        [axiosRequest]
    );

    return {
        hentFagsystemVedtak,
        fagsystemVedtak,
    };
};
