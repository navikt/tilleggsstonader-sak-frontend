import React from 'react';

import { Table } from '@navikt/ds-react';

import DokumentRad from './DokumentRad';
import { Underrad } from './Underrad';
import { grupperDokumenterPåJournalpost, sorterJournalpostPåTid } from './utils';
import { DokumentInfo } from '../../../typer/dokument';

export const DokumentTabell: React.FC<{ dokumenter: DokumentInfo[] }> = ({ dokumenter }) => {
    const dokumenterGrupperPåJournalpost = grupperDokumenterPåJournalpost(dokumenter);
    const journalposterSortertPåTid = sorterJournalpostPåTid(dokumenterGrupperPåJournalpost);

    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Dato</Table.HeaderCell>
                    <Table.HeaderCell>Inn/ut</Table.HeaderCell>
                    <Table.HeaderCell>Tittel</Table.HeaderCell>
                    <Table.HeaderCell>Avsender/mottaker</Table.HeaderCell>
                    <Table.HeaderCell>Tema</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {journalposterSortertPåTid.map((journalpost) =>
                    dokumenterGrupperPåJournalpost[journalpost].map((dokument, indeks) =>
                        indeks === 0 ? (
                            <DokumentRad key={dokument.dokumentInfoId} dokument={dokument} />
                        ) : (
                            <Underrad key={dokument.dokumentInfoId} dokument={dokument} />
                        )
                    )
                )}
            </Table.Body>
        </Table>
    );
};
