import React from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { registerYtelseTilTekst } from '../../../../typer/registerytelser';
import { formaterIsoDato, formaterNullableIsoDato } from '../../../../utils/dato';
import { YtelseGrunnlagPeriode } from '../typer/vilkårperiode';

const HvitTabell = styled(Table)`
    background: white;
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const RegisterYtelserTabell: React.FC<{
    perioderMedYtelse: YtelseGrunnlagPeriode[];
    lagRadForPeriode: (valgPeriode: YtelseGrunnlagPeriode) => void;
}> = ({ perioderMedYtelse, lagRadForPeriode }) => {
    return (
        <HvitTabell size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
                    <Table.HeaderCell scope="col" />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioderMedYtelse.map((ytelse, indeks) => {
                    return (
                        <Table.Row key={indeks}>
                            <Table.DataCell>{registerYtelseTilTekst[ytelse.type]}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(ytelse.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterNullableIsoDato(ytelse.tom)}</Table.DataCell>
                            <Table.DataCell>
                                <Button size="xsmall" onClick={() => lagRadForPeriode(ytelse)}>
                                    Bruk
                                </Button>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </HvitTabell>
    );
};

export default RegisterYtelserTabell;
