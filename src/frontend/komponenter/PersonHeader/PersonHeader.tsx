import React from 'react';

import styled from 'styled-components';

import { BodyShort, CopyButton, Heading, HStack, Link } from '@navikt/ds-react';
import { ABorderStrong, ASpacing2, ASpacing4 } from '@navikt/ds-tokens/dist/tokens';

import TagAdressebeskyttelse from './TagAdressebeskyttelse';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import SmallWarningTag from '../SmallWarningTag';
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
            <BodyShort>|</BodyShort>

            <TagAdressebeskyttelse adressebeskyttelse={personopplysninger.adressebeskyttelse} />
            {personopplysninger.erSkjermet && <SmallWarningTag>Skjermet</SmallWarningTag>}
            {personopplysninger.harVergemål && <SmallWarningTag>Verge</SmallWarningTag>}
            {personopplysninger.harFullmektig && <SmallWarningTag>Fullmakt</SmallWarningTag>}
        </Container>
    );
};

export default PersonHeader;
