import React, { FC } from 'react';

import styled from 'styled-components';

import { Table } from '@navikt/ds-react';
import { AGray50, AWhite } from '@navikt/ds-tokens/dist/tokens';
import '@navikt/ds-css';

import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoDato } from '../../../../../utils/dato';

const Container = styled.div`
    background-color: ${AWhite};
    padding: 1rem;
`;

const TableRow = styled(Table.Row)`
    border-bottom: hidden;
`;

const TableRowGray = styled(Table.Row).withConfig({
    shouldForwardProp: (prop) => prop !== 'borderbottom',
})<{ borderbottom: boolean }>`
    background-color: ${AGray50};
    border-bottom: ${(props) => (props.borderbottom ? 'initial' : 'hidden')};
`;

interface Props {
    beregningsresultat: BeregningsresultatBoutgifter;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => (
    <Container>
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope={'col'}>Beregningsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Utgiftsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Merutgift</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Stønadsbeløp</Table.HeaderCell>
                </Table.Row>
                {beregningsresultat.perioder.map((periode) => (
                    <React.Fragment key={periode.fom + periode.tom}>
                        <TableRow>
                            <Table.DataCell>{`${formaterIsoDato(periode.fom)} - ${formaterIsoDato(periode.tom)}`}</Table.DataCell>
                            <Table.DataCell />
                            <Table.DataCell>{periode.sumUtgifter}</Table.DataCell>
                            <Table.DataCell>{periode.stønadsbeløp}</Table.DataCell>
                        </TableRow>
                        {periode.utgifter.map((utgift, index, utgifter) => (
                            <TableRowGray
                                key={utgift.fom + utgift.tom}
                                borderbottom={index === utgifter.length - 1}
                            >
                                <Table.DataCell />
                                <Table.DataCell>{`${formaterIsoDato(utgift.fom)} - ${formaterIsoDato(utgift.tom)}`}</Table.DataCell>
                                <Table.DataCell>{utgift.utgift}</Table.DataCell>
                                <Table.DataCell>{utgift.tilUtbetaling}</Table.DataCell>
                            </TableRowGray>
                        ))}
                    </React.Fragment>
                ))}
            </Table.Header>
        </Table>
    </Container>
);

export default Beregningsresultat;
