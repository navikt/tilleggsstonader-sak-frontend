import React from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import PassBarn from './PassBarn/PassBarn';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import DataViewer from '../../../komponenter/DataViewer';
import { NesteStegKnapp } from '../../../komponenter/NesteStegKnapp/NesteStegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Stønadsvilkår = () => {
    const { vilkårsvurdering } = useVilkår();
    const { behandlingErRedigerbar } = useBehandling();

    return (
        <Container>
            <DataViewer
                response={{
                    vilkårsvurderinger: vilkårsvurdering,
                }}
            >
                {({ vilkårsvurderinger }) => <PassBarn vilkårsvurderinger={vilkårsvurderinger} />}
            </DataViewer>
            {behandlingErRedigerbar && (
                <NesteStegKnapp steg={Steg.VILKÅR} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                    Fullfør vilkårsvurdering og gå videre
                </NesteStegKnapp>
            )}
        </Container>
    );
};

export default Stønadsvilkår;
