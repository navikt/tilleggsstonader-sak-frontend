import React from 'react';

import { Alert, HStack, Link, VStack } from '@navikt/ds-react';

import { DokumentTypeTag, Hoveddokument, Vedlegg } from './DokumentKomponenter';
import { useBehandling } from '../../../../context/BehandlingContext';
import { DokumentInfo } from '../../../../typer/dokument';
import {
    grupperDokumenterPåJournalpost,
    sorterJournalpostPåTid,
} from '../../../Personoversikt/Dokumentoversikt/utils';

const Dokumentliste: React.FC<{ dokumenter: DokumentInfo[] }> = ({ dokumenter }) => {
    const { behandling } = useBehandling();

    const dokumenterGruppertPåJournalpost = grupperDokumenterPåJournalpost(dokumenter);
    const journalposterSortertPåTid = sorterJournalpostPåTid(dokumenterGruppertPåJournalpost);

    return (
        <VStack gap="6" style={{ marginTop: '1rem' }}>
            <Alert variant="info" inline size="small">
                Vi viser bare tema TSO og TSR her. Se flere dokumenter{' '}
                <Link
                    variant="neutral"
                    target="_blank"
                    href={`/person/${behandling.fagsakPersonId}/dokumentoversikt`}
                    inlineText
                >
                    i personoversikten
                </Link>
                .
            </Alert>
            {journalposterSortertPåTid.map((journalpost) => {
                const dokumenter = dokumenterGruppertPåJournalpost[journalpost];

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
