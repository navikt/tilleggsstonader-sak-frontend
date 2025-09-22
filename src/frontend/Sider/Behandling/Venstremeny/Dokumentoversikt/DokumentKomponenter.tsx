import React from 'react';

import styled from 'styled-components';

import { PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';

import { Lenke } from '../../../../komponenter/Lenke';
import { DokumentInfo } from '../../../../typer/dokument';
import { Journalposttype } from '../../../../typer/journalpost';
import { formaterDato } from '../../../../utils/dato';

export const Hoveddokument: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <VStack>
            <LenkeTilDokument dokument={dokument} />
            <BodyShort size="small">{formaterDato(dokument.dato)}</BodyShort>
        </VStack>
    );
};

export const Vedlegg: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <HStack gap="2" wrap={false}>
            <PaperclipIcon />
            <LenkeTilDokument dokument={dokument} />
        </HStack>
    );
};

const LenkeTilDokument: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Lenke
            target="_blank"
            href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
        >
            <BodyShort size="small">{dokument.tittel}</BodyShort>
        </Lenke>
    );
};

const KvadratiskTag = styled(Tag).attrs({ size: 'small' })`
    width: 22px;
    height: 22px;
`;

export const DokumentTypeTag: React.FC<{ journalposttype: Journalposttype }> = ({
    journalposttype,
}) => {
    switch (journalposttype) {
        case 'I': // Innkommende
            return <KvadratiskTag variant="alt1">I</KvadratiskTag>;
        case 'U': // Utgående
            return <KvadratiskTag variant="alt2">U</KvadratiskTag>;
        case 'N': // Internt notat
            return <KvadratiskTag variant="alt3">N</KvadratiskTag>;
    }
};
