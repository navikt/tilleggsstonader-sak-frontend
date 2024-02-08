import React, { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { Button, HStack, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import Målgruppe from './Målgruppe/Målgruppe';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { Stønadsperiode } from './typer/stønadsperiode';
import { Vilkårperioder } from './typer/vilkårperiode';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import DataViewer from '../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';
import { features } from '../../../utils/features';
import { erLokalt } from '../../../utils/miljø';
import { FanePath } from '../faner';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Inngangsvilkår = () => {
    const navigate = useNavigate();
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [vilkårperioder, settVilkårperioder] =
        useState<Ressurs<Vilkårperioder>>(byggTomRessurs());
    const [stønadsperioderRessurs, settStønadsperioderRessurs] =
        useState<Ressurs<Stønadsperiode[]>>(byggTomRessurs());

    const hentVilkårperioderCallback = useCallback(() => {
        request<Vilkårperioder, null>(`/api/sak/vilkarperiode/behandling/${behandling.id}`).then(
            settVilkårperioder
        );
    }, [request, behandling.id]);

    const hentVilkårperioder = useRerunnableEffect(hentVilkårperioderCallback, [behandling.id]);

    const hentStønadsperioderCallback = useCallback(() => {
        request<Stønadsperiode[], null>(`/api/sak/stonadsperiode/${behandling.id}`).then(
            settStønadsperioderRessurs
        );
    }, [request, behandling.id]);

    const hentStønadsperioder = useRerunnableEffect(hentStønadsperioderCallback, [behandling.id]);

    return (
        <Container>
            {erLokalt() && <FyllUtVilkårKnapp />}
            <DataViewer
                response={{
                    vilkårperioder,
                    stønadsperioder: stønadsperioderRessurs,
                }}
            >
                {({ vilkårperioder, stønadsperioder }) => (
                    <>
                        {features.nyeInngangsvilkår && (
                            <InngangsvilkårProvider
                                vilkårperioder={vilkårperioder}
                                hentVilkårperioder={hentVilkårperioder}
                                hentedeStønadsperioder={stønadsperioder}
                                hentStønadsperioder={hentStønadsperioder}
                            >
                                <Målgruppe />
                                <Aktivitet />
                                <Stønadsperioder />
                            </InngangsvilkårProvider>
                        )}
                    </>
                )}
            </DataViewer>
            <HStack>
                <Button
                    variant="primary"
                    size="small"
                    onClick={() =>
                        navigate(`/behandling/${behandling.id}/${FanePath.STØNADSVILKÅR}`)
                    }
                >
                    Neste steg
                </Button>
            </HStack>
        </Container>
    );
};

export default Inngangsvilkår;
