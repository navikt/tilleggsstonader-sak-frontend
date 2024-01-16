import React from 'react';

import { Table } from '@navikt/ds-react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { formaterIsoDato } from '../../../../utils/dato';
import { Målgruppe } from '../typer/målgruppe';

const MålgruppeRad: React.FC<{ målgruppe: Målgruppe }> = ({ målgruppe }) => {
    return (
        <Table.ExpandableRow
            key={målgruppe.id}
            togglePlacement={'right'}
            // expansionDisabled={målgruppe.vilkår.delvilkårsett.length === 0}
            content={
                <>
                    {/* <Heading size={'xsmall'}>Vilkårsvurdering</Heading>
                                    <EndreVurderingComponent
                                        vilkårType={målgruppe.vilkår.vilkårType}
                                        regler={regler[målgruppe.vilkår.vilkårType].regler}
                                        vilkår={målgruppe.vilkår}
                                        oppdaterVilkår={oppdaterMålgruppeVilkårState}
                                    />
                                    <Feilmelding>
                                        {vilkårFeilmeldinger[målgruppe.vilkår.id]}
                                    </Feilmelding> */}
                </>
            }
        >
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon vilkårsresultat={målgruppe.resultat} />
            </Table.DataCell>
            <Table.DataCell>{målgruppe.type}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(målgruppe.fom)}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(målgruppe.tom)}</Table.DataCell>
            <Table.DataCell>Kilde</Table.DataCell>
        </Table.ExpandableRow>
    );
};

export default MålgruppeRad;
