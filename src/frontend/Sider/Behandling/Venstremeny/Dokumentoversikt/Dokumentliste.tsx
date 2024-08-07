import React from 'react';

import styled from 'styled-components';

import { PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';

import { Lenke } from '../../../../komponenter/Lenke';
import { DokumentInfo } from '../../../../typer/dokument';
import { Journalposttype } from '../../../../typer/journalpost';
import {
    grupperDokumenterPåJournalpost,
    sorterJournalpostPåTid,
} from '../../../Personoversikt/Dokumentoversikt/utils';

const Dokumentliste: React.FC<{ dokumenter: DokumentInfo[] }> = ({ dokumenter }) => {
    const dokumenterGrupperPåJournalpost = grupperDokumenterPåJournalpost(dokumenter);
    const journalposterSortertPåTid = sorterJournalpostPåTid(dokumenterGrupperPåJournalpost);

    return (
        <VStack gap="6">
            {journalposterSortertPåTid.map((journalpost) => {
                const dokumenter = dokumenterGrupperPåJournalpost[journalpost];

                return (
                    <HStack gap="4" key={journalpost} wrap={false}>
                        <DokumentTypeTag journalposttype={dokumenter[0].journalposttype} />
                        <VStack gap="2">
                            {dokumenter.map((dokument, indeks) => (
                                <HStack wrap={false} key={dokument.dokumentInfoId} gap="2">
                                    {indeks !== 0 && <PaperclipIcon />}
                                    <Lenke
                                        target="_blank"
                                        href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
                                    >
                                        <BodyShort size="small">{dokument.tittel}</BodyShort>
                                    </Lenke>
                                </HStack>
                            ))}
                        </VStack>
                    </HStack>
                );
            })}
        </VStack>
    );
};

export default Dokumentliste;

const StyledTag = styled(Tag).attrs({ size: 'small' })`
    width: 22px;
    height: 22px;
`;

const DokumentTypeTag: React.FC<{ journalposttype: Journalposttype }> = ({ journalposttype }) => {
    switch (journalposttype) {
        case 'I':
            return <StyledTag variant="info">I</StyledTag>;
        case 'N':
            return <StyledTag variant="alt1">N</StyledTag>;
        case 'U':
            return <StyledTag variant="neutral">U</StyledTag>;
    }
};
