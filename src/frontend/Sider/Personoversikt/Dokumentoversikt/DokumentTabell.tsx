import React from 'react';

import { Table } from '@navikt/ds-react';

import DokumentRad from './DokumentRad';
import { Underrad } from './Underrad';
import { DokumentInfo } from '../../../typer/dokument';
import { groupBy } from '../../../utils/utils';

export const DokumentTabell: React.FC<{ dokumenter: DokumentInfo[] }> = ({ dokumenter }) => {
    const dokumentterGrupperPåJournalpost = groupBy(
        dokumenter,
        (dokument) => dokument.journalpostId
    );

    const journalposterSortertPåTid = Object.keys(dokumentterGrupperPåJournalpost).sort(
        function (a, b) {
            const datoA = dokumentterGrupperPåJournalpost[a][0].dato;
            const datoB = dokumentterGrupperPåJournalpost[b][0].dato;
            if (!datoA) {
                return -1;
            } else if (!datoB) {
                return 1;
            }
            return datoA > datoB ? -1 : 1;
        }
    );
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
                    dokumentterGrupperPåJournalpost[journalpost].map((dokument, indeks) =>
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
