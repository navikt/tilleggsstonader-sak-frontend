import React, { useState } from 'react';

import { CopyButton, HStack, Popover, Table } from '@navikt/ds-react';

import Oppgaveknapp from './Oppgaveknapp';
import { utledetFolkeregisterIdent } from './Oppgavetabell';
import { behandlingstemaTilTekst, Oppgave, oppgaveBehandlingstypeTilTekst } from './typer/oppgave';
import { oppgaveTypeTilVisningstekstSomTarHensynTilKlage } from './typer/oppgavetema';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../utils/dato';

const Oppgaverad: React.FC<{ oppgave: Oppgave }> = ({ oppgave }) => {
    const [anker, settAnker] = useState<Element | null>(null);

    const togglePopover = (element: React.MouseEvent<HTMLElement>) => {
        settAnker(anker ? null : element.currentTarget);
    };
    const behandlingstema =
        oppgave.behandlingstema && behandlingstemaTilTekst[oppgave.behandlingstema];

    const behandlingstype =
        oppgave.behandlingstype && oppgaveBehandlingstypeTilTekst[oppgave.behandlingstype];

    const typeBehandling = behandlingstype
        ? behandlingstema
            ? behandlingstype + ' - ' + behandlingstema
            : behandlingstype
        : behandlingstema;

    const folkeregistrertIdent = utledetFolkeregisterIdent(oppgave);

    return (
        <Table.Row key={oppgave.id}>
            <Table.DataCell>
                {oppgave.oppgavetype
                    ? oppgaveTypeTilVisningstekstSomTarHensynTilKlage(
                          oppgave.oppgavetype,
                          oppgave.behandlingstype
                      )
                    : 'Mangler oppgavetype'}
            </Table.DataCell>
            <Table.DataCell>{typeBehandling}</Table.DataCell>
            <Table.DataCell onMouseEnter={togglePopover} onMouseLeave={togglePopover}>
                {formaterNullableIsoDato(oppgave.opprettetTidspunkt)}
                <Popover
                    id={`registreringstidspunkt-for-oppgave-${oppgave.id}`}
                    anchorEl={anker}
                    open={!!anker}
                    onClose={() => settAnker(null)}
                    placement={'right'}
                    tabIndex={-1}
                >
                    <Popover.Content>
                        Registreringstidspunkt:{' '}
                        {formaterNullableIsoDatoTid(oppgave.opprettetTidspunkt)}
                    </Popover.Content>
                </Popover>
            </Table.DataCell>
            <Table.DataCell>
                <HStack align="center" wrap={false}>
                    {folkeregistrertIdent}
                    <CopyButton size="small" copyText={folkeregistrertIdent} />
                </HStack>
            </Table.DataCell>
            <Table.DataCell>{oppgave.navn}</Table.DataCell>
            <Table.DataCell>
                <Oppgaveknapp oppgave={oppgave} />
            </Table.DataCell>
        </Table.Row>
    );
};

export default Oppgaverad;
