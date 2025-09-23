import React from 'react';

import { Table } from '@navikt/ds-react';

import LogiskeVedlegg from './LogiskeVedlegg';
import { Lenke } from '../../../komponenter/Lenke';
import { DokumentInfo } from '../../../typer/dokument';

export const Underrad: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Table.Row>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell style={{ paddingLeft: '3rem' }}>
                <Lenke
                    target="_blank"
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
                >
                    {dokument.tittel}
                </Lenke>
                <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg}></LogiskeVedlegg>
            </Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
        </Table.Row>
    );
};
