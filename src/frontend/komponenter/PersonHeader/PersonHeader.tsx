import React from 'react';

import styled from 'styled-components';

import { BodyShort, CopyButton, Heading, HStack, Link } from '@navikt/ds-react';
import { BorderInfoStrong, Space16, Space8 } from '@navikt/ds-tokens/darkside-js';

import TagAdressebeskyttelse from './TagAdressebeskyttelse';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { formaterIsoDato } from '../../utils/dato';
import { SmallErrorTag, SmallWarningTag } from '../Tags';
import { Sticky } from '../Visningskomponenter/Sticky';

const Container = styled(Sticky)`
    display: flex;
    align-items: center;
    gap: ${Space16};
    top: 48px;

    padding: ${Space8} ${Space16};

    border-bottom: 1px solid ${BorderInfoStrong};
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
            {personopplysninger.harGeografiskTilknytningUtland && (
                <SmallWarningTag>Utland</SmallWarningTag>
            )}
            {personopplysninger.dødsdato && (
                <SmallErrorTag>Død ({formaterIsoDato(personopplysninger.dødsdato)})</SmallErrorTag>
            )}
        </Container>
    );
};

export default PersonHeader;
