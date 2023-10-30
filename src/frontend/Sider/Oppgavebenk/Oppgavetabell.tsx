import React from 'react';

import styled from 'styled-components';

import { Pagination, Table } from '@navikt/ds-react';

import Oppgaverad from './Oppgaverad';
import { IdentGruppe, Oppgave } from './typer/oppgave';
import { usePagineringState } from '../../hooks/felles/usePaginerState';
import { useSorteringState } from '../../hooks/felles/useSorteringState';
import { PartialRecord } from '../../typer/common';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

interface Props {
    oppgaver: Oppgave[];
}

const tabellHeaders: PartialRecord<keyof Oppgave, { tittel: string; erSorterbar?: boolean }> = {
    opprettetTidspunkt: { tittel: 'Reg. dato', erSorterbar: true },
    oppgavetype: { tittel: 'Oppgavetype', erSorterbar: true },
    behandlingstema: { tittel: 'Gjelder', erSorterbar: true },
    fristFerdigstillelse: { tittel: 'Frist', erSorterbar: true },
    beskrivelse: { tittel: 'Beskrivelse' },
    identer: { tittel: 'Ident' },
    tildeltEnhetsnr: { tittel: 'Enhet' },
    tilordnetRessurs: { tittel: 'Saksbehandler' },
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
        <Container>
            {antallSider > 1 && (
                <Pagination page={valgtSide} count={antallSider} onPageChange={settValgtSide} />
            )}
            <Table
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
            </Table>
        </Container>
    );
};

export default Oppgavetabell;
