import React from 'react';

import { styled } from 'styled-components';

import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import Aktivitet from './Aktivitet/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import Målgruppe from './Målgruppe/Målgruppe';
import RegisterAktiviteter from './RegisterAktivteter';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useStønadsperioder } from '../../../hooks/useStønadsperioder';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
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
    const { behandling } = useBehandling();

    const { stønadsperioder } = useStønadsperioder(behandling.id);
    const { vilkårperioderResponse } = useVilkårperioder(behandling.id);

    return (
        <Container>
            {erLokalt() && <FyllUtVilkårKnapp />}
            <DataViewer
                response={{
                    vilkårperioderResponse,
                    stønadsperioder,
                }}
            >
                {({ vilkårperioderResponse, stønadsperioder }) => (
                    <>
                        {features.nyeInngangsvilkår && (
                            <InngangsvilkårProvider
                                vilkårperioder={vilkårperioderResponse.vilkårperioder}
                                hentedeStønadsperioder={stønadsperioder}
                            >
                                <RegisterAktiviteter
                                    aktivitetGrunnlag={vilkårperioderResponse.grunnlag?.aktivitet}
                                />
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
