import React, { useState } from 'react';

import { BodyLong, Button, Table } from '@navikt/ds-react';

import styles from './OppgavelisteArena.module.css';
import { OppgaveArena } from './typer';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/FlexColumn';
import { formaterNullableIsoDato } from '../../../../utils/dato';

const EkspanderbarRad: React.FC<{ oppgave: OppgaveArena }> = ({ oppgave }) => {
    const [open, setOpen] = useState(false);

    return (
        <Table.ExpandableRow
            key={oppgave.id}
            content={<BodyLong className={styles.kommentar}>{oppgave.kommentar}</BodyLong>}
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
            <Table size="small" className={styles.tabell}>
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
            </Table>
        </FlexColumn>
    );
};

export default OppgavelisteArena;
