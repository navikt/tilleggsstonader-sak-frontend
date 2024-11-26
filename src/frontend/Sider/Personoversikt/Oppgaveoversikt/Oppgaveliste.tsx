import React, { useState } from 'react';

import styled from 'styled-components';

import { BodyLong, Button, Table } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { mappeIdTilMappenavn } from './utils';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { formaterNullableIsoDato } from '../../../utils/dato';
import Oppgaveknapp from '../../Oppgavebenk/Oppgaveknapp';
import { utledTypeBehandling } from '../../Oppgavebenk/oppgaveutils';
import { Mappe, Oppgave } from '../../Oppgavebenk/typer/oppgave';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetema';

const Tabell = styled(Table)`
    max-width: 1300px;
    border: 1px solid ${ABorderDivider};
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const Kommentar = styled(BodyLong)`
    white-space: pre-wrap;
`;

const EkspanderbarRad: React.FC<{
    oppgave: Oppgave;
    mapper: Record<number, Mappe>;
    oppdaterOppgaveEtterOppdatering: (oppgave: Oppgave) => void;
    laster: boolean;
    settLaster: React.Dispatch<React.SetStateAction<boolean>>;
    settFeilmelding: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({
    oppgave,
    mapper,
    oppdaterOppgaveEtterOppdatering,
    laster,
    settLaster,
    settFeilmelding,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Table.ExpandableRow
            key={oppgave.id}
            content={<Kommentar>{oppgave.beskrivelse}</Kommentar>}
            togglePlacement={'right'}
            expansionDisabled={true}
            open={open}
        >
            <Table.DataCell>
                {oppgave.oppgavetype && oppgaveTypeTilTekst[oppgave.oppgavetype]}
            </Table.DataCell>
            <Table.DataCell>
                {utledTypeBehandling(oppgave.behandlingstype, oppgave.behandlingstema)}
            </Table.DataCell>
            <Table.DataCell>{formaterNullableIsoDato(oppgave.opprettetTidspunkt)}</Table.DataCell>
            <Table.DataCell>{oppgave.tildeltEnhetsnr}</Table.DataCell>
            <Table.DataCell>{mappeIdTilMappenavn(oppgave.mappeId, mapper)}</Table.DataCell>
            <Table.DataCell>{formaterNullableIsoDato(oppgave.fristFerdigstillelse)}</Table.DataCell>
            <Table.DataCell>{oppgave.tilordnetRessurs}</Table.DataCell>
            <Table.DataCell>
                <Button variant={'tertiary'} size={'small'} onClick={() => setOpen(!open)}>
                    {!open ? 'Vis' : 'Skjul'}
                </Button>
            </Table.DataCell>
            <Table.DataCell>
                <Oppgaveknapp
                    oppgave={oppgave}
                    oppdaterOppgaveEtterOppdatering={oppdaterOppgaveEtterOppdatering}
                    laster={laster}
                    settLaster={settLaster}
                    settFeilmelding={settFeilmelding}
                />
            </Table.DataCell>
        </Table.ExpandableRow>
    );
};

const Oppgaveliste: React.FC<{
    oppgaver: Oppgave[];
    mapper: Record<number, Mappe>;
    oppdaterOppgaveEtterOppdatering: (oppgave: Oppgave) => void;
}> = ({ oppgaver, mapper, oppdaterOppgaveEtterOppdatering }) => {
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    return (
        <FlexColumn>
            <Tabell size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Oppgavetype</Table.ColumnHeader>
                        <Table.ColumnHeader>Stønad</Table.ColumnHeader>
                        <Table.ColumnHeader>Opprettet</Table.ColumnHeader>
                        <Table.ColumnHeader>Enhet</Table.ColumnHeader>
                        <Table.ColumnHeader>Mappe</Table.ColumnHeader>
                        <Table.ColumnHeader>Frist</Table.ColumnHeader>
                        <Table.ColumnHeader>Tildelt</Table.ColumnHeader>
                        <Table.ColumnHeader>Kommentar</Table.ColumnHeader>
                        {/*Knapper*/}
                        <Table.ColumnHeader />
                        {/*ExpandableRow*/}
                        <Table.ColumnHeader />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppgaver.map((oppgave) => (
                        <EkspanderbarRad
                            key={oppgave.id}
                            oppgave={oppgave}
                            mapper={mapper}
                            oppdaterOppgaveEtterOppdatering={oppdaterOppgaveEtterOppdatering}
                            laster={laster}
                            settLaster={settLaster}
                            settFeilmelding={settFeilmelding}
                        />
                    ))}
                </Table.Body>
            </Tabell>
            <Feilmelding variant="alert">{feilmelding}</Feilmelding>
        </FlexColumn>
    );
};

export default Oppgaveliste;
