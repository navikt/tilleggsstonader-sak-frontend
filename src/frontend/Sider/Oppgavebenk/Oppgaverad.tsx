import React, { useState } from 'react';

import { CopyButton, HStack, Popover, Table } from '@navikt/ds-react';

import Oppgaveknapp from './Oppgaveknapp';
import { utledetFolkeregisterIdent } from './Oppgavetabell';
import { Oppgave } from './typer/oppgave';
import { oppgaveTypeTilVisningstekstSomTarHensynTilKlage } from './typer/oppgavetema';
import { useApp } from '../../context/AppContext';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../utils/dato';
import { Saksbehandler } from '../../utils/saksbehandler';
import { utledTypeBehandling } from './oppgaveutils';

const utledTildeltRessurs = (oppgave: Oppgave, saksbehandler: Saksbehandler) => {
    if (!oppgave.tilordnetRessurs) {
        return 'Ikke tildelt';
    } else if (oppgave.tilordnetRessurs === saksbehandler.navIdent) {
        return 'Meg';
    } else {
        return oppgave.tilordnetRessurs;
    }
};

const Oppgaverad: React.FC<{ oppgave: Oppgave }> = ({ oppgave }) => {
    const { saksbehandler } = useApp();
    const [anker, settAnker] = useState<Element | null>(null);

    const togglePopover = (element: React.MouseEvent<HTMLElement>) => {
        settAnker(anker ? null : element.currentTarget);
    };

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
            <Table.DataCell>
                {utledTypeBehandling(oppgave.behandlingstype, oppgave.behandlingstema)}
            </Table.DataCell>
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
            <Table.DataCell>{formaterNullableIsoDato(oppgave.fristFerdigstillelse)}</Table.DataCell>
            <Table.DataCell>
                <HStack align="center" wrap={false}>
                    {folkeregistrertIdent}
                    <CopyButton size="small" copyText={folkeregistrertIdent} />
                </HStack>
            </Table.DataCell>
            <Table.DataCell>{oppgave.navn}</Table.DataCell>
            <Table.DataCell>{utledTildeltRessurs(oppgave, saksbehandler)}</Table.DataCell>
            <Table.DataCell>
                <Oppgaveknapp oppgave={oppgave} />
            </Table.DataCell>
        </Table.Row>
    );
};

export default Oppgaverad;
