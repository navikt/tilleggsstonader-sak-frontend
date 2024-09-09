import React, { useEffect, useState } from 'react';

import { Alert } from '@navikt/ds-react';

import SimuleringTabell from './SimuleringTabell';
import { SimuleringResponse } from './simuleringTyper';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { VedtakBarnetilsyn } from '../../../typer/vedtak';

const SimuleringResultatWrapper: React.FC<{ vedtak: VedtakBarnetilsyn }> = ({ vedtak }) => {
    const { behandling, hentBehandling } = useBehandling();
    const { request } = useApp();

    const [simuleringsresultat, settSimuleringsresultat] =
        useState<Ressurs<SimuleringResponse | null>>(byggTomRessurs());

    useEffect(() => {
        settSimuleringsresultat(byggHenterRessurs());
        request<SimuleringResponse | null, null>(`/api/sak/simulering/${behandling.id}`)
            .then(settSimuleringsresultat)
            .then(() => {
                hentBehandling.rerun(); // Må hente behandling på nytt for å oppdatere behandling med ritkig steg
            });
    }, [request, settSimuleringsresultat, behandling.id, hentBehandling]);

    const utledBeskrivelseIngenSimulering = () => {
        if (vedtak.type === 'AVSLAG') {
            return 'Ingen simulering for vedtaksresultat avslag';
        }
        return 'Ingen simulering lagret for behandling';
    };

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => (
                <>
                    {simuleringsresultat ? (
                        <SimuleringTabell perioder={simuleringsresultat.perioder} />
                    ) : (
                        <Alert variant={'info'} inline>
                            {utledBeskrivelseIngenSimulering()}
                        </Alert>
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default SimuleringResultatWrapper;
