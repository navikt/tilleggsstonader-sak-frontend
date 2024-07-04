import React from 'react';
import { Oppgave } from '../../Oppgavebenk/typer/oppgave';
import { Table } from '@navikt/ds-react';
import { utledTypeBehandling } from '../../Oppgavebenk/oppgaveutils';
import { formaterNullableIsoDato } from '../../../utils/dato';
import styled from 'styled-components';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

const Tabell = styled(Table)`
    max-width: 900px;
    border: 1px solid ${ABorderDivider};
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const Oppgaveliste: React.FC<{ oppgaver: Oppgave[] }> = ({ oppgaver }) => {
    return (
        <Tabell size="small">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Oppgavetype</Table.ColumnHeader>
                    <Table.ColumnHeader>Stønad</Table.ColumnHeader>
                    <Table.ColumnHeader>Opprettet</Table.ColumnHeader>
                    <Table.ColumnHeader>Frist</Table.ColumnHeader>
                    <Table.ColumnHeader>Tildelt</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {oppgaver.map((oppgave) => (
                    <Table.Row key={oppgave.id}>
                        <Table.DataCell>{oppgave.oppgavetype}</Table.DataCell>
                        <Table.DataCell>
                            {utledTypeBehandling(oppgave.behandlingstype, oppgave.behandlingstema)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterNullableIsoDato(oppgave.opprettetTidspunkt)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterNullableIsoDato(oppgave.fristFerdigstillelse)}
                        </Table.DataCell>
                        <Table.DataCell>{oppgave.tilordnetRessurs}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Tabell>
    );
};

export default Oppgaveliste;
