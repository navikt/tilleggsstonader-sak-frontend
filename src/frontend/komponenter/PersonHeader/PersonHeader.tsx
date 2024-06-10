import React from 'react';

import styled from 'styled-components';

import { BodyShort, CopyButton, Heading, HStack, Link, Tag } from '@navikt/ds-react';
import { ABorderStrong, ASpacing2, ASpacing4 } from '@navikt/ds-tokens/dist/tokens';

import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { Sticky } from '../Visningskomponenter/Sticky';

const Container = styled(Sticky)`
    display: flex;
    align-items: center;
    gap: ${ASpacing4};
    top: 48px;

    padding: ${ASpacing2} ${ASpacing4};

    border-bottom: 1px solid ${ABorderStrong};
`;

const PersonHeader: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { personopplysninger } = usePersonopplysninger();

    return (
        <Container>
            <Heading size="xsmall">{personopplysninger.navn.visningsnavn}</Heading>
            <BodyShort>|</BodyShort>
            <HStack gap="2" align="center">
                <Link href={`/person/${fagsakPersonId}`}>{personopplysninger.personIdent}</Link>
                <CopyButton copyText={personopplysninger.personIdent} size="small" />
            </HStack>
            {personopplysninger.harVergemål && (
                <>
                    <BodyShort>|</BodyShort>
                    <Tag variant={'warning'} size={'small'}>
                        Verge
                    </Tag>
                </>
            )}
        </Container>
    );
};

export default PersonHeader;
