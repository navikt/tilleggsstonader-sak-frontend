import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { FagsakPersonMedBehandlinger } from '../typer/fagsak';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';

interface HentFagsakPersonResponse {
    hentFagsakPersonUtvidet: (fagsakPersonId: string) => void;
    fagsakPerson: Ressurs<FagsakPersonMedBehandlinger>;
}

export const useHentFagsakPersonUtvidet = (): HentFagsakPersonResponse => {
    const { request } = useApp();

    const [fagsakPerson, settFagsakPerson] = useState<Ressurs<FagsakPersonMedBehandlinger>>(
        byggTomRessurs()
    );

    const hentFagsakPersonUtvidet = useCallback(
        (fagsakPersonId: string) => {
            request<FagsakPersonMedBehandlinger, null>(
                `/api/sak/fagsak-person/${fagsakPersonId}/utvidet`
            ).then(settFagsakPerson);
        },
        [request]
    );

    return {
        hentFagsakPersonUtvidet,
        fagsakPerson,
    };
};
