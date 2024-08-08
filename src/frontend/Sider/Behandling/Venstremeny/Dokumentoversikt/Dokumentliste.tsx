import React from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
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
        <VStack gap="6" align="start">
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
            {/* <Button
                variant="tertiary"
                icon={<ExternalLinkIcon />}
                size="small"
                onClick={() => navigate(`/person/${behandling.fagsakPersonId}/dokumentoversikt`)}
            >
                Se flere dokumenter
            </Button> */}
            <Alert variant="info" inline size="small">
                Vi viser bare TSO og TSR dokumenter her. Se{' '}
                <Link
                    variant="neutral"
                    target="_blank"
                    href={`/person/${behandling.fagsakPersonId}/dokumentoversikt`}
                    inlineText
                >
                    dokumenter på flere temaer i personoversikten
                    <ExternalLinkIcon />
                </Link>
            </Alert>
        </VStack>
    );
};

export default Dokumentliste;
