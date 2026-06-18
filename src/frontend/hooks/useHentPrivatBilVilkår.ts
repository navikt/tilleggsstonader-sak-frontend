import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';

export interface HarPrivatBilVilkårDto {
    harPrivatBil: boolean;
}

export const erDagligReise = (stønadstype: Stønadstype) =>
    stønadstype === Stønadstype.DAGLIG_REISE_TSO || stønadstype === Stønadstype.DAGLIG_REISE_TSR;

interface UseHentPrivatBilVilkårResponse {
    privatBilVilkårRessurs: Ressurs<HarPrivatBilVilkårDto>;
    hentPrivatBilVilkår: () => void;
}

export const useHentPrivatBilVilkår = (
    behandlingId: string,
    stønadstype: Stønadstype
): UseHentPrivatBilVilkårResponse => {
    const { request } = useApp();

    const [privatBilVilkårRessurs, settPrivatBilVilkårRessurs] = useState<
        Ressurs<HarPrivatBilVilkårDto>
    >(
        erDagligReise(stønadstype)
            ? byggTomRessurs()
            : { status: RessursStatus.SUKSESS, data: { harPrivatBil: false } }
    );

    const hentPrivatBilVilkår = useCallback(() => {
        if (!erDagligReise(stønadstype)) return;
        request<HarPrivatBilVilkårDto, null>(
            `/api/sak/vilkar/daglig-reise/${behandlingId}/har-privat-bil-vilkar`
        ).then(settPrivatBilVilkårRessurs);
    }, [behandlingId, stønadstype, request]);

    useEffect(() => {
        if (erDagligReise(stønadstype)) {
            hentPrivatBilVilkår();
        }
    }, [stønadstype, hentPrivatBilVilkår]);

    return { privatBilVilkårRessurs, hentPrivatBilVilkår };
};
