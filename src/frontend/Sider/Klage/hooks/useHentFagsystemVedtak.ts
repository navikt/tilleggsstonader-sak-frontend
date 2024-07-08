import { useCallback, useState } from 'react';
import { useKlageApp } from '../context/KlageAppContext';
import { erBehandlingRedigerbar, Klagebehandling } from '../typer/klagebehandling/klagebehandling';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { Ressurs, byggRessursSuksess, byggTomRessurs } from '../../../typer/ressurs';

export const useHentFagsystemVedtak = (): {
    hentFagsystemVedtak: (behandling: Klagebehandling) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { axiosRequest } = useKlageApp();

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
