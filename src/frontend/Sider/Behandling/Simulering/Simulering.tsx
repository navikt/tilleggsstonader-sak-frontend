import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import SimuleringResultatWrapper from './SimuleringResultatWrapper';
import { SimuleringResponse } from './simuleringTyper';
import { harVedtaksresultatMedTilkjentYtelse } from './simuleringUtils';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { typeVedtakTilTekst } from '../../../typer/vedtak';

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
            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => (
                    <>
                        {harVedtaksresultatMedTilkjentYtelse(vedtak.type) ? (
                            <SimuleringResultatWrapper />
                        ) : (
                            <Alert variant={'info'} inline>
                                Ingen simulering for vedtaksresultat{' '}
                                {typeVedtakTilTekst[vedtak.type].toLowerCase()}
                            </Alert>
                        )}
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default Simulering;
