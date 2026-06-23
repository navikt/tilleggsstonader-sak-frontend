import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';

export interface HarRammevedtakDto {
    harRammevedtak: boolean;
}

export const erDagligReise = (stønadstype: Stønadstype) =>
    stønadstype === Stønadstype.DAGLIG_REISE_TSO || stønadstype === Stønadstype.DAGLIG_REISE_TSR;

interface UseHarRammevedtakResponse {
    rammevedtakRessurs: Ressurs<HarRammevedtakDto>;
    hentRammevedtak: () => void;
}

export const useHarRammevedtak = (
    behandlingId: string,
    stønadstype: Stønadstype
): UseHarRammevedtakResponse => {
    const { request } = useApp();

    const [rammevedtakRessurs, settRammevedtakRessurs] = useState<Ressurs<HarRammevedtakDto>>(
        erDagligReise(stønadstype)
            ? byggTomRessurs()
            : { status: RessursStatus.SUKSESS, data: { harRammevedtak: false } }
    );

    const hentRammevedtak = useCallback(() => {
        if (!erDagligReise(stønadstype)) return;
        request<HarRammevedtakDto, null>(
            `/api/sak/vilkar/daglig-reise/${behandlingId}/har-rammevedtak`
        ).then(settRammevedtakRessurs);
    }, [behandlingId, stønadstype, request]);

    useEffect(() => {
        if (erDagligReise(stønadstype)) {
            hentRammevedtak();
        }
    }, [stønadstype, hentRammevedtak]);

    return { rammevedtakRessurs, hentRammevedtak };
};
