import React from 'react';

import styled from 'styled-components';

import { BodyShort, CopyButton, HStack, Link, Tag } from '@navikt/ds-react';
import { ABorderStrong, ASpacing2, ASpacing4 } from '@navikt/ds-tokens/dist/tokens';

import TagAdressebeskyttelse from './TagAdressebeskyttelse';
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
            <Link href={`/person/${fagsakPersonId}`}>
                <BodyShort>{personopplysninger.navn.visningsnavn}</BodyShort>
            </Link>
            <BodyShort>|</BodyShort>
            <HStack gap="2" align="center">
                <BodyShort>{personopplysninger.personIdent}</BodyShort>
                <CopyButton copyText={personopplysninger.personIdent} size="small" />
            </HStack>
            <BodyShort>|</BodyShort>
            <TagAdressebeskyttelse adressebeskyttelse={personopplysninger.adressebeskyttelse} />
            {personopplysninger.harVergemål && (
                <Tag variant={'warning'} size={'small'}>
                    Verge
                </Tag>
            )}
        </Container>
    );
};

export default PersonHeader;
