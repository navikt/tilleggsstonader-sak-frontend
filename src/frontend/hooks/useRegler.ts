import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { ReglerResponse } from '../typer/regel';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';

interface Response {
    hentRegler: () => void;
    regler: Ressurs<ReglerResponse>;
}
export const useRegler = (): Response => {
    const { request } = useApp();
    const [regler, settRegler] = useState<Ressurs<ReglerResponse>>(byggTomRessurs());

    const hentRegler = useCallback(() => {
        request<ReglerResponse, null>(`/api/sak/vilkar/regler`).then(settRegler);
    }, [request]);

    return {
        hentRegler,
        regler,
    };
};
