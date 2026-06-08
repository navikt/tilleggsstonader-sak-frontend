import React, { useEffect, useState } from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import Oppsumering from './Oppsumering';
import SimuleringTabell from './SimuleringTabell';
import { SimuleringResponse } from './simuleringTyper';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import Panel from '../../../komponenter/Panel/Panel';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { formaterÅrFullMåned } from '../../../utils/dato';

export const Simuleringsresultat: React.FC<{
    vedtak: VedtakResponse;
    settLaster: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ vedtak, settLaster }) => {
    const { behandling } = useBehandling();
    const { request } = useApp();

    const [simuleringsresultatState, settSimuleringsresultat] =
        useState<Ressurs<SimuleringResponse | null>>(byggTomRessurs());

    useEffect(() => {
        settSimuleringsresultat(byggHenterRessurs());
        request<SimuleringResponse | null, null>(`/api/sak/simulering/${behandling.id}`).then(
            settSimuleringsresultat
        );
    }, [request, settSimuleringsresultat, behandling.id]);

    useEffect(() => {
        settLaster(false);
    }, [behandling, settLaster]);

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
        <DataViewer type={'simuleringsresultat'} response={{ simuleringsresultatState }}>
            {({ simuleringsresultatState: simuleringsresultat }) => {
                const { perioder, oppsummering, varsel } = simuleringsresultat || {};

                return perioder && oppsummering ? (
                    <>
                        <Panel
                            tittel={`Simulering for perioden ${formaterÅrFullMåned(oppsummering.fom)} - ${formaterÅrFullMåned(oppsummering.tom)}`}
                        >
                            {varsel && <Alert variant={'warning'}>{varsel}</Alert>}
                            <Oppsumering oppsummering={oppsummering} />
                            <SimuleringTabell perioder={perioder} />
                            {oppsummering.feilutbetaling > 0 && (
                                <Alert variant={'info'}>
                                    <Heading spacing size="small" level="3">
                                        Feilutbetaling
                                    </Heading>
                                    Behandlingen har resultert i en feilutbetaling. Det er foreløpig
                                    ikke systemstøtte for å opprette en tilbakekrevingsbehandling.
                                    Du kan behandle ferdig denne revurderingen. Det vil komme
                                    nærmere informasjon om hvordan feilutbetalinger skal behandles.
                                </Alert>
                            )}
                        </Panel>
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
