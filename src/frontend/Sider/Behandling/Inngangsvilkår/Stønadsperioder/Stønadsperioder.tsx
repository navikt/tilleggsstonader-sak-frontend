import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import RedigerStønadsperioder from './RedigerStønadsperioder';
import { Stønadsperiode, Vilkårperioder } from '../typer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Stønadsperioder: React.FC<{
    vilkårperioder: Vilkårperioder;
    eksisterendeStønadsperioder: Stønadsperiode[];
}> = ({ vilkårperioder, eksisterendeStønadsperioder }) => {
    return (
        <Container>
            <Heading size="medium">Stønadsperioder</Heading>
            <RedigerStønadsperioder
                eksisterendeStønadsperioder={eksisterendeStønadsperioder}
                vilkårperioder={vilkårperioder}
            />
        </Container>
    );
};

export default Stønadsperioder;
