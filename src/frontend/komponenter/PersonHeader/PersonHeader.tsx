import React from 'react';

import styled from 'styled-components';

import { BodyShort, CopyButton, HStack, Heading } from '@navikt/ds-react';
import { ABorderStrong, ASpacing2, ASpacing4 } from '@navikt/ds-tokens/dist/tokens';

import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { Sticky } from '../Visningskomponenter/Sticky';

const Container = styled(Sticky)`
    display: flex;
    align-items: center;
    gap: ${ASpacing4};

    padding: ${ASpacing2} ${ASpacing4};

    border-bottom: 1px solid ${ABorderStrong};
    top: 48px;
`;

const PersonHeader: React.FC = () => {
    const { personopplysninger } = usePersonopplysninger();

    return (
        <Container>
            <Heading size="xsmall">{personopplysninger.navn.visningsnavn}</Heading>
            <BodyShort>|</BodyShort>
            <HStack gap="2" align="center">
                {personopplysninger.personIdent}
                <CopyButton copyText={personopplysninger.personIdent} size="small" />
            </HStack>
        </Container>
    );
};

export default PersonHeader;
