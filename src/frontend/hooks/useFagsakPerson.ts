import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { FagsakPerson, FagsakPersonMedBehandlinger } from '../typer/fagsak';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';

interface HentFagsakPersonResponse<T> {
    hentFagsakPerson: (fagsakPersonId: string) => void;
    fagsakPerson: Ressurs<T>;
}

export const useHentFagsakPerson = (): HentFagsakPersonResponse<FagsakPerson> => {
    const { request } = useApp();

    const [fagsakPerson, settFagsakPerson] = useState<Ressurs<FagsakPerson>>(byggTomRessurs());

    const hentFagsakPerson = useCallback(
        (fagsakPersonId: string) => {
            request<FagsakPerson, null>(`/api/sak/fagsak-person/${fagsakPersonId}`).then(
                settFagsakPerson
            );
        },
        [request]
    );

    return {
        hentFagsakPerson,
        fagsakPerson,
    };
};

export const useHentFagsakPersonUtvidet =
    (): HentFagsakPersonResponse<FagsakPersonMedBehandlinger> => {
        const { request } = useApp();

        const [fagsakPerson, settFagsakPerson] =
            useState<Ressurs<FagsakPersonMedBehandlinger>>(byggTomRessurs());

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
