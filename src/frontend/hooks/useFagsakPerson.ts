import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { FagsakPersonMedBehandlinger } from '../typer/fagsak';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';

interface HentFagsakPersonResponse<T> {
    hentFagsakPerson: (fagsakPersonId: string) => void;
    fagsakPerson: Ressurs<T>;
}

export const useHentFagsakPersonUtvidet =
    (): HentFagsakPersonResponse<FagsakPersonMedBehandlinger> => {
        const { request } = useApp();

        const [fagsakPerson, settFagsakPerson] = useState<Ressurs<FagsakPersonMedBehandlinger>>(
            byggTomRessurs()
        );

        const hentFagsakPerson = useCallback(
            (fagsakPersonId: string) => {
                request<FagsakPersonMedBehandlinger, null>(
                    `/api/sak/fagsak-person/${fagsakPersonId}/utvidet`
                ).then(settFagsakPerson);
            },
            [request]
        );

        return {
            hentFagsakPerson,
            fagsakPerson,
        };
    };
