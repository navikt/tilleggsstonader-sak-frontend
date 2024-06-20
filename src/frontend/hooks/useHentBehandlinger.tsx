import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { KlageBehandling, HentBehandlingerRequest } from '../typer/behandling/klageBehandling';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface HentBehandlingerResponse {
    hentBehandlinger: (personIdent: string, stønadstype: Stønadstype) => void;
    behandlinger: Ressurs<KlageBehandling[]>;
}
export const useHentBehandlinger = (): HentBehandlingerResponse => {
    const { request } = useApp();
    const [behandlinger, settBehandlinger] = useState<Ressurs<KlageBehandling[]>>(byggTomRessurs());

    const hentBehandlinger = useCallback(
        (ident: string, stønadstype: Stønadstype) => {
            request<KlageBehandling[], HentBehandlingerRequest>(
                `/api/sak/behandling/person`,
                'POST',
                {
                    ident,
                    stønadstype,
                }
            ).then(settBehandlinger);
        },
        [request]
    );

    return {
        hentBehandlinger,
        behandlinger,
    };
};
