import React, { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { Button, Heading, Table } from '@navikt/ds-react';

import LeggTilMålgruppe, { NyMålgruppe } from './LeggTilMålgruppe';
import { formaterIsoPeriode } from '../../../../utils/dato';

interface MålgruppePeriode {
    id: string;
    fom: string;
    tom: string;
    type: MålgruppeType;
    //vilkår: MålgruppeVilkår;
}
/*
interface MålgruppeVilkår {
    type: Vilkårtype;
    resultat: Vilkårsresultat;
    delvilkårsett: Delvilkår[];
}
 */

export enum MålgruppeType {
    AAP = 'AAP',
}

const Målgruppe = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [perioder, settPerioder] = useState<MålgruppePeriode[]>([
        { id: '1', fom: '2023-01-01', tom: '2023-12-31', type: MålgruppeType.AAP },
    ]);

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    const leggTilNyMålgruppe = (nyMålgruppe: NyMålgruppe) => {
        settSkalViseLeggTilPeriode(false);
        settPerioder((prevState) => [...prevState, { ...nyMålgruppe, id: uuidv4() }]);
    };

    return (
        <div>
            <Heading size="large">Målgruppe</Heading>
            <Table>
                <Table.Header>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Header>
                <Table.Body>
                    {perioder.map((periode) => (
                        <Table.ExpandableRow
                            key={periode.id}
                            togglePlacement={'right'}
                            content={<p>hei</p>}
                        >
                            <Table.DataCell>{periode.type}</Table.DataCell>
                            <Table.DataCell>
                                {formaterIsoPeriode(periode.fom, periode.tom)}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
            {skalViseLeggTilPeriode ? (
                <LeggTilMålgruppe leggTilNyMålgruppe={leggTilNyMålgruppe} />
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
