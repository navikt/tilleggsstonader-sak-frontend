import { useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import {
    erFeil,
    Feil,
    feiletRessursTilFeilmelding,
    lagFeilmelding,
} from '../../../komponenter/Feil/feilmeldingUtils';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';

export const useFullførKjøreliste = () => {
    const { request } = useApp();
    const { behandling, hentBehandling } = useBehandling();

    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [harUlagredeEndringer, settHarUlagredeEndringer] = useState<boolean>(false);

    const fullførKjøreliste = () => {
        if (harUlagredeEndringer) {
            settFeilmelding(
                lagFeilmelding(
                    'Du har endret begrunnelsen uten å lagre. Trykk "Lagre begrunnelse" eller fjern teksten før du fullfører.'
                )
            );
            return;
        }
        if (laster) return;
        settLaster(true);
        request<null, null>(
            `/api/sak/behandling/${behandling.id}/fullfør-kjørelistebehandling`,
            'POST'
        )
            .then((res: RessursSuksess<null> | RessursFeilet) => {
                settFeilmelding(undefined);
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    return Promise.resolve();
                } else {
                    return Promise.reject(feiletRessursTilFeilmelding(res));
                }
            })
            .catch((error) =>
                erFeil(error)
                    ? settFeilmelding(error)
                    : settFeilmelding(lagFeilmelding('Ukjent feil oppstod'))
            )
            .finally(() => settLaster(false));
    };
    return { fullførKjøreliste, laster, feilmelding, settHarUlagredeEndringer };
};
