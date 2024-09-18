import React, { useState } from 'react';

import styled from 'styled-components';

import { BodyLong, Button, Table } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { OppgaveArena } from './typer';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { formaterNullableIsoDato } from '../../../../utils/dato';

const Tabell = styled(Table)`
    max-width: 1000px;
    border: 1px solid ${ABorderDivider};
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const Kommentar = styled(BodyLong)`
    white-space: pre-wrap;
`;

const EkspanderbarRad: React.FC<{ oppgave: OppgaveArena }> = ({ oppgave }) => {
    const [open, setOpen] = useState(false);

    return (
        <Table.ExpandableRow
            key={oppgave.id}
            content={<Kommentar>{oppgave.kommentar}</Kommentar>}
            togglePlacement={'right'}
            open={open}
            expansionDisabled={true}
        >
            <Table.DataCell>{oppgave.tittel}</Table.DataCell>
            <Table.DataCell>{formaterNullableIsoDato(oppgave.opprettetTidspunkt)}</Table.DataCell>
            <Table.DataCell>{oppgave.benk}</Table.DataCell>
            <Table.DataCell>{oppgave.tildelt}</Table.DataCell>
            <Table.DataCell>
                <Button variant={'tertiary'} size={'small'} onClick={() => setOpen(!open)}>
                    {!open ? 'Vis' : 'Skjul'}
                </Button>
            </Table.DataCell>
        </Table.ExpandableRow>
    );
};

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
                        <Table.ColumnHeader>Kommentar</Table.ColumnHeader>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppgaver.map((oppgave) => (
                        <EkspanderbarRad key={oppgave.id} oppgave={oppgave} />
                    ))}
                </Table.Body>
            </Tabell>
        </FlexColumn>
    );
};

export default OppgavelisteArena;
