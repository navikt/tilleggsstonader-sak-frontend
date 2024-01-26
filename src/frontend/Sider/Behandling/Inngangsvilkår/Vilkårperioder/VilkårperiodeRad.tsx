import React, { useState } from 'react';

import { styled } from 'styled-components';

import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';
import { ABgSubtle } from '@navikt/ds-tokens/dist/tokens';

import SlettVilkRperiodeModal from './SlettVilkårperiodeModal';
import { useBehandling } from '../../../../context/BehandlingContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { formaterIsoDato } from '../../../../utils/dato';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';
import { VilkårPeriode, VilkårPeriodeResultat } from '../typer/vilkårperiode';

const TabellRad = styled(Table.Row)<{ disabled?: boolean }>`
    background: ${(props) => (props.disabled ? ABgSubtle : '')};
`;

const VilkårperiodeRad: React.FC<{
    vilkårperiode: VilkårPeriode;
    type: MålgruppeType | AktivitetType;
    startRedigering: () => void;
}> = ({ vilkårperiode, type, startRedigering }) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [visSlettModal, settVisSlettModal] = useState(false);
    const visRedigerKnapper =
        vilkårperiode.resultat != VilkårPeriodeResultat.SLETTET && behandlingErRedigerbar;

    return (
        <TabellRad
            key={vilkårperiode.id}
            disabled={vilkårperiode.resultat === VilkårPeriodeResultat.SLETTET}
        >
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon vilkårsresultat={vilkårperiode.resultat} />
            </Table.DataCell>
            <Table.DataCell>{type}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(vilkårperiode.fom)}</Table.DataCell>
            <Table.DataCell>{formaterIsoDato(vilkårperiode.tom)}</Table.DataCell>
            <Table.DataCell>{vilkårperiode.kilde}</Table.DataCell>
            <Table.DataCell>
                {visRedigerKnapper && (
                    <>
                        <Button
                            onClick={startRedigering}
                            variant="secondary"
                            size="small"
                            icon={<PencilIcon />}
                        >
                            Endre
                        </Button>
                        <Button
                            icon={<TrashIcon />}
                            size={'small'}
                            variant={'tertiary'}
                            onClick={() => settVisSlettModal(true)}
                        />
                        <SlettVilkRperiodeModal
                            visModal={visSlettModal}
                            settVisModal={settVisSlettModal}
                            vilkårperiode={vilkårperiode}
                            type={type}
                        />
                    </>
                )}
            </Table.DataCell>
        </TabellRad>
    );
};

export default VilkårperiodeRad;
