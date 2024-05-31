import React from 'react';

import { Link, Table } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { DokumentInfo } from '../../../typer/dokument';
import { journalstatuserTilTekst } from '../../../typer/journalpost';
import { formaterNullableIsoDatoTid } from '../../../utils/dato';

const DokumentRad: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Table.Row style={{ backgroundColor: `${AGray50}` }}>
            <Table.DataCell>{formaterNullableIsoDatoTid(dokument.dato)}</Table.DataCell>
            <Table.DataCell>{dokument.journalposttype}</Table.DataCell>
            <Table.DataCell>
                <Link
                    target="_blank"
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
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
