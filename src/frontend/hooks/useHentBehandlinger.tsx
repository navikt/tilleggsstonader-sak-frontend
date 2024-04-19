import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Behandling, HentBehandlingerRequest } from '../typer/behandling/behandling';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface HentBehandlingerResponse {
    hentBehandlinger: (personIdent: string, stønadstype: Stønadstype) => void;
    behandlinger: Ressurs<Behandling[]>;
}
export const useHentBehandlinger = (): HentBehandlingerResponse => {
    const { request } = useApp();
    const [behandlinger, settBehandlinger] = useState<Ressurs<Behandling[]>>(byggTomRessurs());

    const hentBehandlinger = useCallback(
        (ident: string, stønadstype: Stønadstype) => {
            request<Behandling[], HentBehandlingerRequest>(`/api/sak/behandling/person`, 'POST', {
                ident,
                stønadstype,
            }).then(settBehandlinger);
        },
        [request]
    );

    return {
        hentBehandlinger,
        behandlinger,
    };
};
