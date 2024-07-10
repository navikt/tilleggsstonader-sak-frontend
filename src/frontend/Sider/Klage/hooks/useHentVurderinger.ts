import { useCallback, useState } from 'react';

import { IVurdering } from '../Steg/Vurdering/vurderingValg';
import {
    RessursSuksess,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
} from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';

interface IMelding {
    tekst: string;
    type: 'success' | 'error';
}

export const useHentVurderinger = () => {
    const { request } = useApp();
    const [melding, settMelding] = useState<IMelding>();

    const [vurdering, settVurdering] = useState<Ressurs<IVurdering>>(byggTomRessurs);

    const hentVurdering = useCallback(
        (behandlingId: string) => {
            request<IVurdering, null>(`/api/klage/vurdering/${behandlingId}`).then(settVurdering);
        },
        [request]
    );

    const lagreVurdering = (
        vurdering: IVurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        return request<IVurdering, IVurdering>(`/api/klage/vurdering`, 'POST', vurdering).then(
            (respons) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settVurdering(respons);
                    settMelding({
                        tekst: 'Vurderingen er lagret',
                        type: 'success',
                    });
                } else {
                    settMelding({
                        tekst: respons.frontendFeilmelding || 'Noe gikk galt ved innsending',
                        type: 'error',
                    });
                }
                return respons;
            }
        );
    };

    return {
        vurdering,
        hentVurdering,
        lagreVurdering,
        melding,
        settMelding,
    };
};
