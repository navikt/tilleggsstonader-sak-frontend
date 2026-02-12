import { useCallback, useState } from 'react';

import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import { Feil, feiletRessursTilFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import { RessursStatus } from '../../../typer/ressurs';

export const useHentBehandlinger = () => {
    const { request } = useApp();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil | undefined>(undefined);

    const hentBehandlinger = useCallback(async (): Promise<void> => {
        if (laster) return;
        settFeilmelding(undefined);
        settLaster(true);
        try {
            const response = await request<Oppfølging[], null>(`/api/sak/oppfolging`);
            if (response.status !== RessursStatus.SUKSESS) {
                settFeilmelding(
                    feiletRessursTilFeilmelding(response, 'Feil ved henting av oppfølginger')
                );
            }
        } catch {
            settFeilmelding({ feilmelding: 'Ukjent feil ved henting av oppfølginger' });
        } finally {
            settLaster(false);
        }
    }, [laster, request]);

    return { hentBehandlinger, laster, feilmelding };
};
