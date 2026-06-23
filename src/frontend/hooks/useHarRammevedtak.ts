import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

export interface HarRammevedtakDto {
    harRammevedtak: boolean;
}

interface UseHarRammevedtakResponse {
    rammevedtakRessurs: Ressurs<HarRammevedtakDto>;
    hentRammevedtak: () => void;
}

export const useHarRammevedtak = (behandlingId: string): UseHarRammevedtakResponse => {
    const { request } = useApp();

    const [rammevedtakRessurs, settRammevedtakRessurs] =
        useState<Ressurs<HarRammevedtakDto>>(byggTomRessurs());

    const hentRammevedtak = useCallback(() => {
        request<HarRammevedtakDto, null>(
            `/api/sak/vilkar/daglig-reise/${behandlingId}/har-rammevedtak`
        ).then(settRammevedtakRessurs);
    }, [behandlingId, request]);

    useEffect(() => {
        hentRammevedtak();
    }, [hentRammevedtak]);

    return { rammevedtakRessurs, hentRammevedtak };
};
