import React from 'react';

import styled from 'styled-components';

import { Pagination, Table } from '@navikt/ds-react';

import Oppgaverad from './Oppgaverad';
import { IdentGruppe, Oppgave } from './typer/oppgave';
import { usePagineringState } from '../../hooks/felles/usePaginerState';
import { useSorteringState } from '../../hooks/felles/useSorteringState';
import { PartialRecord } from '../../typer/common';
const Tabell = styled(Table)`
    width: 1100px;
`;
interface Props {
    oppgaver: Oppgave[];
}

const tabellHeaders: PartialRecord<keyof Oppgave, { tittel: string; erSorterbar?: boolean }> = {
    oppgavetype: { tittel: 'Oppgavetype', erSorterbar: false },
    behandlingstema: { tittel: 'Stønad', erSorterbar: false },
    opprettetTidspunkt: { tittel: 'Opprettet', erSorterbar: true },
    identer: { tittel: 'Ident' },
    tilordnetRessurs: { tittel: 'Saksbehandler' },
    fristFerdigstillelse: { tittel: 'Frist', erSorterbar: true },
};

export const utledetFolkeregisterIdent = (oppgave: Oppgave) =>
    oppgave.identer?.filter((i) => i.gruppe === IdentGruppe.FOLKEREGISTERIDENT)[0].ident ||
    'Ukjent ident';

const Oppgavetabell: React.FC<Props> = ({ oppgaver }) => {
    const { sortertListe, settSortering, sortState } = useSorteringState<Oppgave>(oppgaver, {
        orderBy: 'fristFerdigstillelse',
        direction: 'ascending',
    });

    const { valgtSide, settValgtSide, slicedListe, antallSider } = usePagineringState(
        sortertListe,
        1,
        15
    );

    return (
        <>
            <Tabell
                size="small"
                sort={sortState}
                onSortChange={(sortKey) => settSortering(sortKey as keyof Oppgave)}
                zebraStripes
            >
                <Table.Header>
                    <Table.Row>
                        {Object.entries(tabellHeaders).map(([key, value], indeks) => (
                            <Table.ColumnHeader
                                key={`${indeks}${key}`}
                                sortKey={key}
                                sortable={value.erSorterbar}
                            >
                                {value.tittel}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {slicedListe.map((oppgave) => (
                        <Oppgaverad key={oppgave.id} oppgave={oppgave} />
                    ))}
                </Table.Body>
            </Tabell>
            {antallSider > 1 && (
                <Pagination
                    page={valgtSide}
                    count={antallSider}
                    onPageChange={settValgtSide}
                    size="small"
                />
            )}
        </>
    );
};

export default Oppgavetabell;
