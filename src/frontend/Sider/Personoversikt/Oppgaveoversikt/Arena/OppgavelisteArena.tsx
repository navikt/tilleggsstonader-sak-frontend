import React from 'react';

import styled from 'styled-components';

import { Table } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { OppgaveArena } from './typer';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { formaterNullableIsoDato } from '../../../../utils/dato';

const Tabell = styled(Table)`
    max-width: 900px;
    border: 1px solid ${ABorderDivider};
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const OppgavelisteArena: React.FC<{
    oppgaver: OppgaveArena[];
}> = ({ oppgaver }) => {
    return (
        <FlexColumn>
            <Tabell size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Tittel</Table.ColumnHeader>
                        <Table.ColumnHeader>Opprettet</Table.ColumnHeader>
                        <Table.ColumnHeader>Benk</Table.ColumnHeader>
                        <Table.ColumnHeader>Tildelt</Table.ColumnHeader>
                        <Table.ColumnHeader />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppgaver.map((oppgave) => (
                        <Table.Row key={oppgave.id}>
                            <Table.DataCell>{oppgave.tittel}</Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(oppgave.opprettetTidspunkt)}
                            </Table.DataCell>
                            <Table.DataCell>{oppgave.benk}</Table.DataCell>
                            <Table.DataCell>{oppgave.tildelt}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Tabell>
        </FlexColumn>
    );
};

export default OppgavelisteArena;
