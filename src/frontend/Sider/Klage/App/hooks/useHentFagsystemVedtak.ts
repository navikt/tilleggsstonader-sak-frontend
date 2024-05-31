import { useCallback, useState } from 'react';
import { byggSuksessRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Behandling } from '../typer/fagsak';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { erBehandlingRedigerbar } from '../typer/behandlingstatus';

export const useHentFagsystemVedtak = (): {
    hentFagsystemVedtak: (behandling: Behandling) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { axiosRequest } = useApp();

    const [fagsystemVedtak, settFagsystemVedtak] =
        useState<Ressurs<FagsystemVedtak[]>>(byggTomRessurs);

    const hentFagsystemVedtak = useCallback(
        (behandling: Behandling) => {
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
