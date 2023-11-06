import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';
import { InnvilgeVedtakForBarnetilsyn } from '../typer/vedtak';

interface Response {
    hentVedtak: (behandlingId: string) => void;
    vedtak: Ressurs<InnvilgeVedtakForBarnetilsyn>;
}

export const useVedtak = (): Response => {
    const { request } = useApp();
    const [vedtak, settVedtak] = useState<Ressurs<InnvilgeVedtakForBarnetilsyn>>(byggTomRessurs());

    const hentVedtak = useCallback(
        (behandlingId: string) => {
            request<InnvilgeVedtakForBarnetilsyn, null>(
                `/api/sak/vedtak/tilsyn-barn/${behandlingId}`
            ).then(settVedtak);
        },
        [request]
    );

    return {
        hentVedtak,
        vedtak,
    };
};
