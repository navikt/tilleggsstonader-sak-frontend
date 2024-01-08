import React from 'react';

import { Table } from '@navikt/ds-react';

import { DokumentInfo } from '../../../typer/dokument';

const DokumentRad: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Table.Row>
            <Table.DataCell>{dokument.dato}</Table.DataCell>
            <Table.DataCell>{dokument.journalposttype}</Table.DataCell>
            <Table.DataCell>{dokument.tittel}</Table.DataCell>
            <Table.DataCell>{dokument.avsenderMottaker?.navn}</Table.DataCell>
            <Table.DataCell>{dokument.tema}</Table.DataCell>
            <Table.DataCell>{dokument.journalstatus}</Table.DataCell>
        </Table.Row>
    );
};

export default DokumentRad;
