import React from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { DokumentTypeTag, Hoveddokument, Vedlegg } from './DokumentKomponenter';
import { DokumentInfo } from '../../../../typer/dokument';
import {
    grupperDokumenterPåJournalpost,
    sorterJournalpostPåTid,
} from '../../../Personoversikt/Dokumentoversikt/utils';

const Dokumentliste: React.FC<{ dokumenter: DokumentInfo[] }> = ({ dokumenter }) => {
    const dokumenterGrupertPåJournalpost = grupperDokumenterPåJournalpost(dokumenter);
    const journalposterSortertPåTid = sorterJournalpostPåTid(dokumenterGrupertPåJournalpost);

    return (
        <VStack gap="6">
            {journalposterSortertPåTid.map((journalpost) => {
                const dokumenter = dokumenterGrupertPåJournalpost[journalpost];

                return (
                    <HStack gap="4" key={journalpost} wrap={false}>
                        <DokumentTypeTag journalposttype={dokumenter[0].journalposttype} />
                        <VStack gap="2">
                            {dokumenter.map((dokument, indeks) => (
                                <HStack wrap={false} key={dokument.dokumentInfoId} gap="2">
                                    {indeks === 0 ? (
                                        <Hoveddokument dokument={dokument} />
                                    ) : (
                                        <Vedlegg dokument={dokument} />
                                    )}
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
