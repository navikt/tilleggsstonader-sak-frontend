import React from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import HentGrunnlagPåNyttKnapp from './HentGrunnlagPåNyttKnapp';
import Målgruppe from './Målgruppe/Målgruppe';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useStønadsperioder } from '../../../hooks/useStønadsperioder';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { erLokalt } from '../../../utils/miljø';
import { FanePath } from '../faner';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem;
`;

const Inngangsvilkår = () => {
    const { behandling } = useBehandling();

    const { stønadsperioder } = useStønadsperioder(behandling.id);
    const { vilkårperioderResponse, hentVilkårperioder } = useVilkårperioder(behandling.id);

    return (
        <Container>
            <VarselVedtakIArena />

            {erLokalt() && <FyllUtVilkårKnapp />}

            <DataViewer
                response={{
                    vilkårperioderResponse,
                    stønadsperioder,
                }}
            >
                {({ vilkårperioderResponse, stønadsperioder }) => (
                    <InngangsvilkårProvider
                        vilkårperioder={vilkårperioderResponse.vilkårperioder}
                        hentedeStønadsperioder={stønadsperioder}
                    >
                        <HentGrunnlagPåNyttKnapp
                            vilkårperioder={vilkårperioderResponse}
                            hentVilkårperioder={hentVilkårperioder}
                        />
                        <VStack gap="12">
                            <Aktivitet grunnlag={vilkårperioderResponse.grunnlag} />
                            <Målgruppe grunnlag={vilkårperioderResponse.grunnlag} />
                            <Stønadsperioder />
                        </VStack>
                    </InngangsvilkårProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.INNGANGSVILKÅR} nesteFane={FanePath.STØNADSVILKÅR}>
                Ferdigstill inngangsvilkår og gå videre
            </StegKnapp>
        </Container>
    );
};

export default Inngangsvilkår;
