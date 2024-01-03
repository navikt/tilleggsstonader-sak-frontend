import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import RedigerStønadsperioder from './RedigerStønadsperioder';
import VisStønadsperioder from './VisStønadsperiode';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Stønadsperiode, Vilkårperioder } from '../typer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Stønadsperioder: React.FC<{
    vilkårperioder: Vilkårperioder;
    stønadsperioder: Stønadsperiode[];
}> = ({ vilkårperioder, stønadsperioder }) => {
    const { redigererStønadsperioder } = useInngangsvilkår();
    return (
        <Container>
            <Heading size="medium">Stønadsperioder</Heading>

            {redigererStønadsperioder ? (
                <RedigerStønadsperioder
                    eksisterendeStønadsperioder={stønadsperioder}
                    vilkårperioder={vilkårperioder}
                />
            ) : (
                <VisStønadsperioder stønadsperioder={stønadsperioder} />
            )}
        </Container>
    );
};

export default Stønadsperioder;
