import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Regelstruktur } from '../Sider/Behandling/Stønadsvilkår/DagligReise/typer/regelstrukturDagligReise';
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

export const useRegelstruktur = (): {
    regelStruktur: Ressurs<Regelstruktur>;
} => {
    const { request } = useApp();

    const [regelStruktur, settRegelstruktur] = useState<Ressurs<Regelstruktur>>(byggTomRessurs());

    const hentRegelstruktur = useCallback(() => {
        request<Regelstruktur, null>('/api/sak/vilkar/daglig-reise/regler', 'GET').then(
            settRegelstruktur
        );
    }, [request]);

    useEffect(() => {
        hentRegelstruktur();
    }, [hentRegelstruktur]);

    return {
        regelStruktur,
    };
};
