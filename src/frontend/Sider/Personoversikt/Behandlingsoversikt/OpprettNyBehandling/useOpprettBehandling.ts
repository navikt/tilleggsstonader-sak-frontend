import { useState } from 'react';

import { erÅpneBehandlingerFunnet, OpprettBehandlingResponse } from './opprettBehandlingTypes';
import {
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../../komponenter/Feil/feilmeldingUtils';
import { erFeilressurs, Ressurs, RessursStatus } from '../../../../typer/ressurs';

export interface UseOpprettBehandlingReturn {
    laster: boolean;
    feilmelding: Feil | undefined;
    settFeilmelding: (feil: Feil | undefined) => void;
    åpneBehandlingerFunnet: boolean;
    settÅpneBehandlingerFunnet: (funnet: boolean) => void;
    utførOpprett: (
        requestCallback: () => Promise<Ressurs<OpprettBehandlingResponse>>,
        onSuccess: () => void
    ) => void;
}

export function useOpprettBehandling(): UseOpprettBehandlingReturn {
    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<Feil | undefined>(undefined);
    const [åpneBehandlingerFunnet, settÅpneBehandlingerFunnet] = useState(false);

    async function utførOpprett(
        requestCallback: () => Promise<Ressurs<OpprettBehandlingResponse>>,
        onSuccess: () => void
    ): Promise<void> {
        if (laster) return;

        settLaster(true);
        settFeilmelding(undefined);
        settÅpneBehandlingerFunnet(false);

        const response = await requestCallback();

        if (response.status === RessursStatus.SUKSESS) {
            if (erÅpneBehandlingerFunnet(response.data)) {
                settÅpneBehandlingerFunnet(true);
            } else {
                onSuccess();
            }
        } else if (erFeilressurs(response)) {
            settFeilmelding(feiletRessursTilFeilmelding(response));
        } else {
            settFeilmelding(lagFeilmelding('En ukjent feil oppstod'));
        }

        settLaster(false);
    }

    return {
        laster,
        feilmelding,
        settFeilmelding,
        åpneBehandlingerFunnet,
        settÅpneBehandlingerFunnet,
        utførOpprett,
    };
}
