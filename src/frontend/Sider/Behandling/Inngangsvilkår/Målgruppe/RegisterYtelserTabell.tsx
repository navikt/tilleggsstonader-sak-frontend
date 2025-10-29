import React from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/darkside-js';

import { utledYtelseTekst } from './utils';
import { useSteg } from '../../../../context/StegContext';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { formaterIsoDato, formaterNullableIsoDato } from '../../../../utils/dato';
import { YtelseGrunnlagPeriode } from '../typer/vilkårperiode/vilkårperiode';

const HvitTabell = styled(Table)`
    background: white;
    --ac-table-row-border: ${BorderNeutralSubtle};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${BorderNeutralSubtle};
`;

const RegisterYtelserTabell: React.FC<{
    perioderMedYtelse: YtelseGrunnlagPeriode[];
    lagRadForPeriode: (valgPeriode: YtelseGrunnlagPeriode) => void;
}> = ({ perioderMedYtelse, lagRadForPeriode }) => {
    const { erStegRedigerbart } = useSteg();

    return (
        <HvitTabell size="small">
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall scope="col">Ytelse</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Startdato</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Sluttdato</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col" />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioderMedYtelse.map((ytelse, indeks) => {
                    return (
                        <Table.Row key={indeks}>
                            <TableDataCellSmall>{utledYtelseTekst(ytelse)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(ytelse.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>
                                {formaterNullableIsoDato(ytelse.tom)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {erStegRedigerbart && ytelse.kanYtelseBrukesIBehandling && (
                                    <Button size="xsmall" onClick={() => lagRadForPeriode(ytelse)}>
                                        Bruk
                                    </Button>
                                )}
                            </TableDataCellSmall>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </HvitTabell>
    );
};

export default RegisterYtelserTabell;
