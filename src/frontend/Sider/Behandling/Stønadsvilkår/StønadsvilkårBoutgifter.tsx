import React from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';
import { VarselRevurderFraDatoMangler } from '../Felles/VarselRevurderFraDatoMangler';
import { OppsummeringVilkårperioder } from '../OppsummeringVilkår/OppsummeringVilkårperioder';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const StønadsvilkårBoutgifter = () => {
    const { behandling } = useBehandling();

    return (
        <Container>
            <VarselRevurderFraDatoMangler />
            <OppsummeringVilkårperioder behandlingId={behandling.id} />
            <StegKnapp steg={Steg.VILKÅR} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                Fullfør vilkårsvurdering og gå videre
            </StegKnapp>
        </Container>
    );
};

export default StønadsvilkårBoutgifter;
