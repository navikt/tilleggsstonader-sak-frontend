import React from 'react';

import { Link, Table } from '@navikt/ds-react';

import { DokumentInfo, journalstatuserTilTekst } from '../../../typer/dokument';
import { formaterIsoDatoTid } from '../../../utils/dato';

const DokumentRad: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Table.Row>
            <Table.DataCell>{formaterIsoDatoTid(dokument.dato)}</Table.DataCell>
            <Table.DataCell>{dokument.journalposttype}</Table.DataCell>
            <Table.DataCell>
                <Link
                    target="_blank"
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}`}
                >
                    {dokument.tittel}
                </Link>
            </Table.DataCell>
            <Table.DataCell>{dokument.avsenderMottaker?.navn}</Table.DataCell>
            <Table.DataCell>{dokument.tema}</Table.DataCell>
            <Table.DataCell>{journalstatuserTilTekst[dokument.journalstatus]}</Table.DataCell>
        </Table.Row>
    );
};

export default DokumentRad;
