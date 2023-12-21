import React from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';

import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Stønadsperiode } from '../typer';

export type StønadsperiodeForm = {
    stønadsperioder: Stønadsperiode[];
};

const VisStønadsperioder: React.FC<{
    stønadsperioder: Stønadsperiode[];
}> = ({ stønadsperioder }) => {
    const { startRedigerStønadsperioder } = useInngangsvilkår();

    return (
        <>
            <Table>
                <Table.Header>
                    <Table.HeaderCell>Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell>Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell>Fra</Table.HeaderCell>
                    <Table.HeaderCell>Til</Table.HeaderCell>
                </Table.Header>
                {stønadsperioder.map((stønadsperiode) => (
                    <Table.Row>
                        <Table.DataCell>{stønadsperiode.målgruppe}</Table.DataCell>
                        <Table.DataCell>{stønadsperiode.aktivitet}</Table.DataCell>
                        <Table.DataCell>{stønadsperiode.fom}</Table.DataCell>
                        <Table.DataCell>{stønadsperiode.tom}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table>
            <Button
                size="small"
                variant="secondary"
                icon={<PencilIcon />}
                onClick={startRedigerStønadsperioder}
                style={{ maxWidth: 'fit-content' }}
            >
                Rediger stønadsperioder
            </Button>
        </>
    );
};

export default VisStønadsperioder;
