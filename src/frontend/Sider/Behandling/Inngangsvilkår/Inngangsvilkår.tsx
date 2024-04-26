import React, { useCallback, useState } from 'react';

import { styled } from 'styled-components';

import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

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
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { features } from '../../../utils/features';
import { erLokalt } from '../../../utils/miljø';
import { FanePath } from '../faner';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin: 2rem;
`;

const VilkårContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 2rem;
    background-color: ${ABlue50};
`;

const Inngangsvilkår = () => {
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
                                <VilkårContainer>
                                    <Aktivitet />
                                    <Målgruppe />
                                </VilkårContainer>
                                <Stønadsperioder />
                            </InngangsvilkårProvider>
                        )}
                    </>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.INNGANGSVILKÅR} nesteFane={FanePath.STØNADSVILKÅR}>
                Ferdigstill inngangsvilkår og gå videre
            </StegKnapp>
        </Container>
    );
};

export default Inngangsvilkår;
