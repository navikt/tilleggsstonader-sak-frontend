import { useCallback, useState } from 'react';
import { byggSuksessRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Klagebehandling } from '../typer/fagsak';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { erBehandlingRedigerbar } from '../typer/behandlingstatus';

export const useHentFagsystemVedtak = (): {
    hentFagsystemVedtak: (behandling: Klagebehandling) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { axiosRequest } = useApp();

    const [fagsystemVedtak, settFagsystemVedtak] =
        useState<Ressurs<FagsystemVedtak[]>>(byggTomRessurs);

    const hentFagsystemVedtak = useCallback(
        (behandling: Klagebehandling) => {
            if (erBehandlingRedigerbar(behandling)) {
                axiosRequest<FagsystemVedtak[], null>({
                    method: 'GET',
                    url: `/api/klage/behandling/${behandling.id}/fagsystem-vedtak`,
                }).then(settFagsystemVedtak);
            } else {
                const fagsystemVedtak = behandling.påklagetVedtak.fagsystemVedtak;
                settFagsystemVedtak(byggSuksessRessurs(fagsystemVedtak ? [fagsystemVedtak] : []));
            }
        },
        [axiosRequest]
    );

    return {
        hentFagsystemVedtak,
        fagsystemVedtak,
    };
};
