import React from 'react';

import { Table } from '@navikt/ds-react';

import { BeregningsresultatTilsynBarn } from '../../../../typer/vedtak/vedtakTilsynBarn';
import { formaterNullableIsoDato } from '../../../../utils/dato';

type Props = {
    beregningsresultat: BeregningsresultatTilsynBarn;
};

const VedtakshistorikkTilsynBarnTabellVisning: React.FC<Props> = ({ beregningsresultat }) => {
    if (beregningsresultat === undefined) return 'Ingen vedtakshistorikk';
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til.</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ant. barn</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {beregningsresultat.beregningsresultat.vedtaksperioder?.map(
                    ({ fom, tom, målgruppe, aktivitet, antallBarn }) => {
                        return (
                            <Table.Row key={fom}>
                                <Table.DataCell>{formaterNullableIsoDato(fom)}</Table.DataCell>
                                <Table.DataCell>{formaterNullableIsoDato(tom)}</Table.DataCell>
                                <Table.DataCell>{aktivitet.toString()}</Table.DataCell>
                                <Table.DataCell>{målgruppe.toString()}</Table.DataCell>
                                <Table.DataCell>{antallBarn.toString()}</Table.DataCell>
                            </Table.Row>
                        );
                    }
                )}
            </Table.Body>
        </Table>
    );
};

export default VedtakshistorikkTilsynBarnTabellVisning;
