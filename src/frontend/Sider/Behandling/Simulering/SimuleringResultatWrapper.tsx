import React, { useEffect, useState } from 'react';

import { Alert, Button, Heading } from '@navikt/ds-react';

import Oppsumering from './Oppsumering';
import SimuleringTabell from './SimuleringTabell';
import { SimuleringResponse } from './simuleringTyper';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import DataViewer from '../../../komponenter/DataViewer';
import Panel from '../../../komponenter/Panel/Panel';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { formaterÅrFullMåned } from '../../../utils/dato';
import { FanePath } from '../faner';

const SimuleringResultatWrapper: React.FC<{ vedtak: VedtakResponse }> = ({ vedtak }) => {
    const { behandling, hentBehandling } = useBehandling();
    const { request } = useApp();

    const [simuleringsresultatState, settSimuleringsresultat] =
        useState<Ressurs<SimuleringResponse | null>>(byggTomRessurs());

    useEffect(() => {
        settSimuleringsresultat(byggHenterRessurs());
        request<SimuleringResponse | null, null>(`/api/sak/simulering/${behandling.id}`)
            .then(settSimuleringsresultat)
            .then(() => {
                hentBehandling.rerun(); // Må hente behandling på nytt for å oppdatere behandling med ritkig steg
            });
    }, [request, settSimuleringsresultat, behandling.id, hentBehandling]);

    const navigate = useNavigateUtenSjekkForUlagredeKomponenter();

    const gåTilNesteSteg = () => {
        navigate(`/behandling/${behandling.id}/${FanePath.BREV}`);
    };

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
                const { perioder, oppsummering } = simuleringsresultat || {};

                return perioder && oppsummering ? (
                    <>
                        <Panel
                            tittel={`Simulering for perioden ${formaterÅrFullMåned(oppsummering.fom)} - ${formaterÅrFullMåned(oppsummering.tom)}`}
                        >
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
                        {behandling.resultat === BehandlingResultat.IKKE_SATT &&
                            behandling.status !== BehandlingStatus.FATTER_VEDTAK && (
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={() => {
                                        gåTilNesteSteg();
                                    }}
                                >
                                    Neste
                                </Button>
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
