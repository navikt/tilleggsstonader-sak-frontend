import React from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { formaterIsoDato } from '../../../../utils/dato';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';
import { VilkårPeriode } from '../typer/vilkårperiode';

const VilkårperiodeRad: React.FC<{
    vilkårperiode: VilkårPeriode;
    type: MålgruppeType | AktivitetType;
    startRedigering: () => void;
}> = ({ vilkårperiode, type, startRedigering }) => {
    return (
        <Table.Row key={vilkårperiode.id}>
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon vilkårsresultat={vilkårperiode.resultat} />
            </Table.DataCell>
            <Table.DataCell>{type}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(vilkårperiode.fom)}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(vilkårperiode.tom)}</Table.DataCell>
            <Table.DataCell>{vilkårperiode.kilde}</Table.DataCell>
            <Table.DataCell>
                <Button
                    onClick={startRedigering}
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

export default VilkårperiodeRad;
