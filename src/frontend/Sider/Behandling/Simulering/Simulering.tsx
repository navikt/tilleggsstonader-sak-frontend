import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import Oppsumering from './Oppsumering';
import SimuleringTabell from './SimuleringTabell';
import { SimuleringResponse } from './simuleringTyper';
import { harVedtaksresultatMedTilkjentYtelse } from './simuleringUtils';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';

const Container = styled.div`
    margin: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: fit-content;
`;

const Simulering: React.FC = () => {
    const { behandling } = useBehandling();
    const { request } = useApp();
    const { vedtak } = useVedtak();

    const [simuleringsresultat, settSimuleringsresultat] =
        useState<Ressurs<SimuleringResponse>>(byggTomRessurs());

    useEffect(() => {
        if (
            vedtak.status === RessursStatus.SUKSESS &&
            harVedtaksresultatMedTilkjentYtelse(vedtak.data.type)
        ) {
            request<SimuleringResponse, null>(`/api/sak/simulering/${behandling.id}`).then(
                settSimuleringsresultat
            );
        }
    }, [request, settSimuleringsresultat, behandling.id, vedtak]);

    return (
        <Container>
            <DataViewer response={{ simuleringsresultat }}>
                {({ simuleringsresultat }) => (
                    <>
                        <Oppsumering oppsumering={simuleringsresultat.oppsummering} />
                        <SimuleringTabell perioder={simuleringsresultat.perioder} />
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default Simulering;
