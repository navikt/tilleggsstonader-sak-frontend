import { useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { feiletRessursTilFeilmelding, Feil } from '../../../../komponenter/Feil/feilmeldingUtils';
import { RessursStatus } from '../../../../typer/ressurs';
import { Toast } from '../../../../typer/toast';

interface OppdaterGrunnlag {
    oppdaterGrunnlag: (henteFom?: string) => void;
    laster: boolean;
    feilmelding: Feil | undefined;
}

export const useOppdaterGrunnlag = (hentVilkårperioder: () => void): OppdaterGrunnlag => {
    const { request, settToast } = useApp();
    const { behandling } = useBehandling();
    const [laster, settLaster] = useState(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const oppdaterGrunnlag = (hentFom?: string) => {
        if (laster) {
            return;
        }
        settFeilmelding(undefined);
        settLaster(true);
        request<null, { hentFom: string | undefined }>(
            `/api/sak/vilkarperiode/behandling/${behandling.id}/oppdater-grunnlag`,
            'POST',
            {
                hentFom,
            }
        )
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    settToast(Toast.OPPDATERT_GRUNNLAG_VILKÅRPERIODE);
                    hentVilkårperioder();
                } else {
                    settFeilmelding(
                        feiletRessursTilFeilmelding(response, 'Oppdatering av grunnlag feilet')
                    );
                }
            })
            .finally(() => settLaster(false));
    };

    return {
        oppdaterGrunnlag,
        laster,
        feilmelding,
    };
};
