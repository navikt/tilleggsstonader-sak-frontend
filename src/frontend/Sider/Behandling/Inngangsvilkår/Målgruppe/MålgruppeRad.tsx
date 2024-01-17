import React from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { formaterIsoDato } from '../../../../utils/dato';
import { Målgruppe } from '../typer/målgruppe';

const MålgruppeRad: React.FC<{ målgruppe: Målgruppe }> = ({ målgruppe }) => {
    return (
        <Table.Row key={målgruppe.id}>
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon vilkårsresultat={målgruppe.resultat} />
            </Table.DataCell>
            <Table.DataCell>{målgruppe.type}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(målgruppe.fom)}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(målgruppe.tom)}</Table.DataCell>
            <Table.DataCell>{målgruppe.kilde}</Table.DataCell>
            <Table.DataCell>
                <Button
                    // TODO: OnClick sett redigeringsmodus
                    variant="secondary"
                    size="small"
                    icon={<PencilIcon />}
                >
                    Endre
                </Button>
            </Table.DataCell>
        </Table.Row>
    );
};

export default MålgruppeRad;
