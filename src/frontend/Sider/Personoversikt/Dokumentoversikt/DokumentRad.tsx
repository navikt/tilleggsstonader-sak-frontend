import React from 'react';

import { Table } from '@navikt/ds-react';

import { DokumentInfo, journalstatuserTilTekst } from '../../../typer/dokument';
import { formaterIsoDatoTid } from '../../../utils/dato';

const DokumentRad: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Table.Row>
            <Table.DataCell>{formaterIsoDatoTid(dokument.dato)}</Table.DataCell>
            <Table.DataCell>{dokument.journalposttype}</Table.DataCell>
            <Table.DataCell>{dokument.tittel}</Table.DataCell>
            <Table.DataCell>{dokument.avsenderMottaker?.navn}</Table.DataCell>
            <Table.DataCell>{dokument.tema}</Table.DataCell>
            <Table.DataCell>{journalstatuserTilTekst[dokument.journalstatus]}</Table.DataCell>
        </Table.Row>
    );
};

export default DokumentRad;
