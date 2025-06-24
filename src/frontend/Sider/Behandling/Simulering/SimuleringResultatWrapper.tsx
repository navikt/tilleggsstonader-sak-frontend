import React, { useEffect, useState } from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import Oppsumering from './Oppsumering';
import SimuleringTabell from './SimuleringTabell';
import { SimuleringResponse } from './simuleringTyper';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { formaterÅrFullMåned } from '../../../utils/dato';

const SimuleringResultatWrapper: React.FC<{ vedtak: VedtakResponse }> = ({ vedtak }) => {
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

    const utledBeskrivelseIngenSimulering = (simuleringsresultat: SimuleringResponse | null) => {
        if (vedtak.type === 'AVSLAG') {
            return 'Ingen simulering for vedtaksresultat avslag';
        }
        if (simuleringsresultat?.ingenEndringIUtbetaling) {
            return 'Ingen endring i tidligere utbetalinger';
        }
        return 'Ingen simulering lagret for behandling';
    };

    return (
        <DataViewer type={'simuleringsresultat'} response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => {
                const { perioder, oppsummering } = simuleringsresultat || {};

                return perioder && oppsummering ? (
                    <>
                        <Heading size={'medium'}>
                            {`Simulering for perioden ${formaterÅrFullMåned(oppsummering.fom)} - ${formaterÅrFullMåned(oppsummering.tom)}`}
                        </Heading>
                        <Oppsumering oppsummering={oppsummering} />
                        <SimuleringTabell perioder={perioder} />
                        {oppsummering.feilutbetaling > 0 && (
                            <Alert variant={'info'}>
                                <Heading spacing size="small" level="3">
                                    Feilutbetaling
                                </Heading>
                                Behandlingen har resultert i en feilutbetaling. Det er foreløpig
                                ikke systemstøtte for å opprette en tilbakekrevingsbehandling. Du
                                kan behandle ferdig denne revurderingen. Det vil komme nærmere
                                informasjon om hvordan feilutbetalinger skal behandles.
                            </Alert>
                        )}
                    </>
                ) : (
                    <Alert variant={'info'} inline>
                        {utledBeskrivelseIngenSimulering(simuleringsresultat)}
                    </Alert>
                );
            }}
        </DataViewer>
    );
};

export default SimuleringResultatWrapper;
