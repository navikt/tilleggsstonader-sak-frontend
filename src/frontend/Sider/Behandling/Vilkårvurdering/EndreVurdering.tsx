import React, { FC } from 'react';

import styled from 'styled-components';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';

const TittelOgKnappContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

const EndreVurdering: FC = () => {
    return (
        <TittelOgKnappContainer>
            <Heading size={'small'} level={'3'}>
                Vilkår vurderes
            </Heading>
            <Button type="button" variant="tertiary" icon={<ArrowUndoIcon />} size={'small'}>
                Avbryt
            </Button>
        </TittelOgKnappContainer>
    );
};
export default EndreVurdering;
