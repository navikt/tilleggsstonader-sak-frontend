import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { Fagsak, FagsakRequest } from '../typer/fagsak';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface HentFagsakResponse {
    hentFagsak: (personIdent: string, stønadstype: Stønadstype) => void;
    fagsak: Ressurs<Fagsak>;
}
export const useHentFagsak = (): HentFagsakResponse => {
    const { request } = useApp();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());

    const hentFagsak = useCallback(
        (personIdent: string, stønadstype: Stønadstype) => {
            request<Fagsak, FagsakRequest>(`/api/sak/fagsak`, 'POST', {
                personIdent,
                stønadstype,
            }).then((res: Ressurs<Fagsak>) => settFagsak(res));
        },
        [request]
    );

    return {
        hentFagsak,
        fagsak,
    };
};
