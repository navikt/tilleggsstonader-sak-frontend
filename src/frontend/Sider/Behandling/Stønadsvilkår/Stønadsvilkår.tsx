import React from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import PassBarn from './PassBarn/PassBarn';
import { useVilkår } from '../../../context/VilkårContext';
import DataViewer from '../../../komponenter/DataViewer';
import { NesteStegKnapp } from '../../../komponenter/NesteStegKnapp/NesteStegKnapp';
import { FanePath } from '../faner';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Stønadsvilkår = () => {
    const { vilkårsvurderinger } = useVilkår();

    return (
        <Container>
            <DataViewer
                response={{
                    vilkårsvurderinger,
                }}
            >
                {({ vilkårsvurderinger }) => <PassBarn vilkårsvurderinger={vilkårsvurderinger} />}
            </DataViewer>
            <NesteStegKnapp nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                Fullfør vilkårsvurdering og gå videre
            </NesteStegKnapp>
        </Container>
    );
};

export default Stønadsvilkår;
