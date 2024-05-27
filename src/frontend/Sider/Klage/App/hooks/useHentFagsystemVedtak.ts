import { useState } from 'react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { Behandling } from '../typer/fagsak';
import { FagsystemVedtak } from '../typer/fagsystemVedtak';
import { fagsystemVedakDummydata } from '../api/klage-stubs';

export const useHentFagsystemVedtak = (): {
    hentFagsystemVedtak: (behandling: Behandling) => void;
    fagsystemVedtak: Ressurs<FagsystemVedtak[]>;
} => {
    const { axiosRequest } = useApp();

    const [fagsystemVedtak, settFagsystemVedtak] =
        useState<Ressurs<FagsystemVedtak[]>>(byggTomRessurs);

    // const hentFagsystemVedtak = useCallback(
    //     (behandling: Behandling) => {
    //         if (erBehandlingRedigerbar(behandling)) {
    //             axiosRequest<FagsystemVedtak[], null>({
    //                 method: 'GET',
    //                 url: `/familie-klage/api/behandling/${behandling.id}/fagsystem-vedtak`,
    //             }).then(settFagsystemVedtak);
    //         } else {
    //             const fagsystemVedtak = behandling.påklagetVedtak.fagsystemVedtak;
    //             settFagsystemVedtak(byggSuksessRessurs(fagsystemVedtak ? [fagsystemVedtak] : []));
    //         }
    //     },
    //     [axiosRequest]
    // );


    // TODO: Ta i bruk den ekte funksjonen når vi har fått på plass backend
    const hentFagsystemVedtak = () => {
        settFagsystemVedtak({ status: RessursStatus.SUKSESS, data: fagsystemVedakDummydata });
    };

    return {
        hentFagsystemVedtak,
        fagsystemVedtak,
    };
};
