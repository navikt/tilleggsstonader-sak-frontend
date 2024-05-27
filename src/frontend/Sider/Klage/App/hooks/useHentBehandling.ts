import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { Behandling } from '../typer/fagsak';
import { behandlingDummydata } from '../api/klage-stubs';

// export const useHentBehandling = (
//     behandlingId: string
// ): {
//     hentBehandlingCallback: () => void;
//     behandling: Ressurs<Behandling>;
// } => {
//     const { axiosRequest } = useApp();
//     const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());
//
//     const hentBehandlingCallback = useCallback(() => {
//         const behandlingConfig: AxiosRequestConfig = {
//             method: 'GET',
//             url: `/familie-klage/api/behandling/${behandlingId}`,
//         };
//         axiosRequest<Behandling, null>(behandlingConfig).then((res: Ressurs<Behandling>) =>
//             settBehandling(res)
//         );
//     }, [axiosRequest, behandlingId]);
//
//     return {
//         hentBehandlingCallback,
//         behandling,
//     };
// };

// TODO: Ta i bruk den ekte funksjonen når vi har fått på plass backend
export const useHentBehandling = (
    behandlingId: string
): {
    hentBehandlingCallback: () => void;
    behandling: Ressurs<Behandling>;
} => {
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());

    const hentBehandlingCallback = () => {
        settBehandling({ status: RessursStatus.SUKSESS, data: behandlingDummydata });
    };

    return {
        hentBehandlingCallback,
        behandling,
    };
};
