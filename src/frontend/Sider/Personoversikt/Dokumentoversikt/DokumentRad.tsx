import React from 'react';

import { Table } from '@navikt/ds-react';
import { BgNeutralSoft } from '@navikt/ds-tokens/darkside-js';

import LogiskeVedlegg from './LogiskeVedlegg';
import { Lenke } from '../../../komponenter/Lenke';
import { arkivtemaerTilTekst } from '../../../typer/arkivtema';
import { DokumentInfo } from '../../../typer/dokument';
import { journalstatuserTilTekst } from '../../../typer/journalpost';
import { formaterNullableIsoDatoTid } from '../../../utils/dato';

const DokumentRad: React.FC<{ dokument: DokumentInfo }> = ({ dokument }) => {
    return (
        <Table.Row style={{ backgroundColor: `${BgNeutralSoft}` }}>
            <Table.DataCell>{formaterNullableIsoDatoTid(dokument.dato)}</Table.DataCell>
            <Table.DataCell>{dokument.journalposttype}</Table.DataCell>
            <Table.DataCell>
                <Lenke
                    target="_blank"
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentInfoId}`}
                >
                    {dokument.tittel}
                </Lenke>
                <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg}></LogiskeVedlegg>
            </Table.DataCell>
            <Table.DataCell>{dokument.avsenderMottaker?.navn}</Table.DataCell>
            <Table.DataCell>{dokument.tema && arkivtemaerTilTekst[dokument.tema]}</Table.DataCell>
            <Table.DataCell>{journalstatuserTilTekst[dokument.journalstatus]}</Table.DataCell>
        </Table.Row>
    );
};

export default DokumentRad;
