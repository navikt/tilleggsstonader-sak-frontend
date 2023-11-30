import React, { useState } from 'react';

import { Button, Heading, Table } from '@navikt/ds-react';

import LeggTilMålgruppe from './LeggTilMålgruppe';
import { formaterIsoPeriode } from '../../../../utils/dato';

interface MålgruppePeriode {
    id: string;
    fom: string;
    tom: string;
    type: MålgruppeType;
}

export enum MålgruppeType {
    AAP = 'AAP',
}

const Målgruppe = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [perioder, settPerioder] = useState<MålgruppePeriode[]>([
        { id: '1', fom: '2023-01-01', tom: '2023-12-31', type: MålgruppeType.AAP },
    ]);

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    return (
        <div>
            <Heading size="large">Målgruppe</Heading>
            <Table>
                <Table.Header>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {perioder.map((periode) => (
                        <Table.Row key={periode.id}>
                            <Table.DataCell>{periode.type}</Table.DataCell>
                            <Table.DataCell>
                                {formaterIsoPeriode(periode.fom, periode.tom)}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {skalViseLeggTilPeriode ? (
                <>
                    <LeggTilMålgruppe />
                    <Button
                        onClick={() => settSkalViseLeggTilPeriode((prevState) => !prevState)}
                        size="small"
                    >
                        Lagre
                    </Button>
                </>
            ) : (
                <Button
                    onClick={() => settSkalViseLeggTilPeriode((prevState) => !prevState)}
                    size="small"
                >
                    Legg til ny målgruppeperiode
                </Button>
            )}
        </div>
    );
};

export default Målgruppe;
