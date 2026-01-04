import React, { useState } from 'react';

import { BodyLong, Button, Table } from '@navikt/ds-react';

import styles from './Oppgaveliste.module.css';
import { mappeIdTilMappenavn } from './utils';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/FlexColumn';
import { formaterNullableIsoDato } from '../../../utils/dato';
import {
    FeilmeldingHåndterOppgave,
    FeilmeldingHåndterOppgaveModal,
} from '../../Oppgavebenk/FeilmeldingHåndterOppgaveModal';
import Oppgaveknapp from '../../Oppgavebenk/Oppgaveknapp';
import { utledTypeBehandling } from '../../Oppgavebenk/oppgaveutils';
import { Mappe, Oppgave } from '../../Oppgavebenk/typer/oppgave';
import { oppgaveTypeTilTekst } from '../../Oppgavebenk/typer/oppgavetema';

const EkspanderbarRad: React.FC<{
    oppgave: Oppgave;
    mapper: Record<number, Mappe>;
    oppdaterOppgaveEtterOppdatering: (oppgave: Oppgave) => void;
    laster: boolean;
    settLaster: React.Dispatch<React.SetStateAction<boolean>>;
    settFeilmelding: React.Dispatch<React.SetStateAction<FeilmeldingHåndterOppgave | undefined>>;
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
            content={<BodyLong className={styles.kommentar}>{oppgave.beskrivelse}</BodyLong>}
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
    hentOppgaver: () => void;
}> = ({ oppgaver, mapper, oppdaterOppgaveEtterOppdatering, hentOppgaver }) => {
    const [feilmelding, settFeilmelding] = useState<FeilmeldingHåndterOppgave>();
    const [laster, settLaster] = useState<boolean>(false);

    return (
        <FlexColumn>
            <Table size="small" className={styles.tabell}>
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
            </Table>
            <FeilmeldingHåndterOppgaveModal
                feilmelding={feilmelding}
                hentOppgaver={hentOppgaver}
                nullstillFeilmelding={() => settFeilmelding(undefined)}
            />
        </FlexColumn>
    );
};

export default Oppgaveliste;
