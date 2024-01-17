import React from 'react';

import styled from 'styled-components';

import { Button, Select, Table } from '@navikt/ds-react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { Målgruppe, MålgruppeType } from '../typer/målgruppe';

const KnappeRad = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const EndreMålgruppeRad: React.FC<{ målgruppe: Målgruppe; avbrytRedigering: () => void }> = ({
    målgruppe,
    avbrytRedigering,
}) => {
    return (
        <Table.Row key={målgruppe.id}>
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon vilkårsresultat={målgruppe.resultat} />
            </Table.DataCell>
            <Table.DataCell>
                <Select label="Type" hideLabel size="small" value={målgruppe.type}>
                    {Object.keys(MålgruppeType).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </Select>
            </Table.DataCell>
            <Table.DataCell>
                <DateInput
                    label={'Fra'}
                    hideLabel
                    value={målgruppe.fom}
                    // eslint-disable-next-line no-console
                    onChange={(dato) => console.log(dato)}
                    size="small"
                />
            </Table.DataCell>
            <Table.DataCell>
                <DateInput
                    label={'Til'}
                    hideLabel
                    value={målgruppe.tom}
                    // eslint-disable-next-line no-console
                    onChange={(dato) => console.log(dato)}
                    size="small"
                />
            </Table.DataCell>
            <Table.DataCell>{målgruppe.kilde}</Table.DataCell>
            <Table.DataCell>
                <KnappeRad>
                    <Button size="small">Lagre</Button>
                    <Button onClick={avbrytRedigering} variant="secondary" size="small">
                        Avbryt
                    </Button>
                </KnappeRad>
            </Table.DataCell>
        </Table.Row>
    );
};

export default EndreMålgruppeRad;
