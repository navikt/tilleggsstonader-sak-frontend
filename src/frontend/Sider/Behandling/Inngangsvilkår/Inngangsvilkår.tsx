import React, { useCallback, useState } from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import Målgruppe from './Målgruppe/Målgruppe';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { Stønadsperiode } from './typer/stønadsperiode';
import { Vilkårperioder } from './typer/vilkårperiode';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useSteg } from '../../../context/StegContext';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import DataViewer from '../../../komponenter/DataViewer';
import { NesteStegKnapp } from '../../../komponenter/NesteStegKnapp/NesteStegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { features } from '../../../utils/features';
import { erLokalt } from '../../../utils/miljø';
import { FanePath } from '../faner';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Inngangsvilkår = () => {
    const { request } = useApp();
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { erStegRedigerbart } = useSteg();

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
                                {erLokalt() && erStegRedigerbart && (
                                    <FyllUtVilkårKnapp type={'inngangsvilkår'} />
                                )}
                                <Målgruppe />
                                <Aktivitet />
                                <Stønadsperioder />
                            </InngangsvilkårProvider>
                        )}
                    </>
                )}
            </DataViewer>
            {behandlingErRedigerbar && (
                <NesteStegKnapp steg={Steg.INNGANGSVILKÅR} nesteFane={FanePath.STØNADSVILKÅR}>
                    Ferdigstill inngangsvilkår og gå videre
                </NesteStegKnapp>
            )}
        </Container>
    );
};

export default Inngangsvilkår;
