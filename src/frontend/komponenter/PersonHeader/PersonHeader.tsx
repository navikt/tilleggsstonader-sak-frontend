import React from 'react';

import { BodyShort, CopyButton, Heading, HStack, Link } from '@navikt/ds-react';

import styles from './PersonHeader.module.css';
import TagAdressebeskyttelse from './TagAdressebeskyttelse';
import { usePersonopplysninger } from '../../context/PersonopplysningerContext';
import { formaterIsoDato } from '../../utils/dato';
import { SmallErrorTag, SmallWarningTag } from '../Tags';
import { Sticky } from '../Visningskomponenter/Sticky';

const PersonHeader: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { personopplysninger } = usePersonopplysninger();
    return (
        <Sticky className={styles.container}>
            <Heading size="xsmall">
                {personopplysninger.navn.visningsnavn} ({personopplysninger.alder} år)
            </Heading>
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
        </Sticky>
    );
};

export default PersonHeader;
