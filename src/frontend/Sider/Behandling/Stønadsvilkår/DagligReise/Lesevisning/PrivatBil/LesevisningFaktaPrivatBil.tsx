import React, { FC } from 'react';

import { Table } from '@navikt/ds-react';

import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { formaterIsoPeriode } from '../../../../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaPrivatBil } from '../../typer/faktaDagligReise';

export const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall scope={'col'} style={{ width: '24%' }}>
                        Periode
                    </TableHeaderCellSmall>
                    <TableHeaderCellSmall scope={'col'} style={{ width: '24%' }}>
                        Reisedager pr uke
                    </TableHeaderCellSmall>
                    <TableHeaderCellSmall scope={'col'} style={{ width: '24%' }}>
                        Bompenger per dag
                    </TableHeaderCellSmall>
                    <TableHeaderCellSmall scope={'col'} style={{ width: '24%' }}>
                        Fergekostnader per dag
                    </TableHeaderCellSmall>
                </Table.Row>
            </Table.Header>
            <Table.Body style={{ verticalAlign: 'top' }}>
                {fakta.faktaDelperioder.map((periode, index) => (
                    <Table.Row key={index}>
                        <TableDataCellSmall>
                            {formaterIsoPeriode(periode.fom, periode.tom)}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {periode?.reisedagerPerUke ? `${periode.reisedagerPerUke}` : '-'}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {' '}
                            {periode?.bompengerPerDag
                                ? `${formaterTallMedTusenSkilleEllerStrek(periode?.bompengerPerDag)} kr`
                                : '-'}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {periode?.fergekostnadPerDag
                                ? `${formaterTallMedTusenSkilleEllerStrek(periode.fergekostnadPerDag)} kr`
                                : '-'}
                        </TableDataCellSmall>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
