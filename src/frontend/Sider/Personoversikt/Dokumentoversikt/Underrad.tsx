import React from 'react';

import { Link, Table } from '@navikt/ds-react';

import { DokumentInfo } from '../../../typer/dokument';

export const Underrad: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Table.Row>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell style={{ paddingLeft: '3rem' }}>
                <Link
                    target="_blank"
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
                >
                    {dokument.tittel}
                </Link>
            </Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
        </Table.Row>
    );
};
