import React from 'react';

import { PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react';

import styles from './DokumentKomponenter.module.css';
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
        <HStack gap="space-8" wrap={false}>
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

export const DokumentTypeTag: React.FC<{ journalposttype: Journalposttype }> = ({
    journalposttype,
}) => {
    switch (journalposttype) {
        case 'I': // Innkommende
            return (
                <Tag
                    data-color="meta-purple"
                    size="small"
                    className={styles.kvadratiskTag}
                    variant="outline"
                >
                    I
                </Tag>
            );
        case 'U': // Utgående
            return (
                <Tag
                    data-color="meta-lime"
                    size="small"
                    className={styles.kvadratiskTag}
                    variant="outline"
                >
                    U
                </Tag>
            );
        case 'N': // Internt notat
            return (
                <Tag
                    data-color="info"
                    size="small"
                    className={styles.kvadratiskTag}
                    variant="outline"
                >
                    N
                </Tag>
            );
    }
};
