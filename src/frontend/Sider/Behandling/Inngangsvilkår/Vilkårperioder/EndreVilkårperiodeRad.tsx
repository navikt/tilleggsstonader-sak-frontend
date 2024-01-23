import React from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { Periode } from '../../../../utils/periode';
import { KildeVilkårsperiode, VilkårPeriode, VilkårPeriodeResultat } from '../typer/vilkårperiode';

const TabellRad = styled(Table.Row)`
    .navds-table__data-cell {
        border-color: transparent;
        vertical-align: top;
    }
`;

const KnappeRad = styled.div`
    display: flex;
    gap: 0.5rem;
`;

interface Props {
    vilkårperiode?: VilkårPeriode;
    periodeForm: Periode;
    avbrytRedigering: () => void;
    lagre: () => void;
    oppdaterPeriode: (key: keyof Periode, nyVerdi: string) => void;
    typeSelect: React.ReactNode;
    periodeFeil?: FormErrors<Periode>;
}

const EndreVilkårperiodeRad: React.FC<Props> = ({
    vilkårperiode,
    periodeForm,
    avbrytRedigering,
    lagre,
    oppdaterPeriode,
    typeSelect,
    periodeFeil,
}) => {
    return (
        <TabellRad>
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon
                    vilkårsresultat={vilkårperiode?.resultat || VilkårPeriodeResultat.IKKE_VURDERT}
                />
            </Table.DataCell>
            <Table.DataCell>{typeSelect}</Table.DataCell>
            <Table.DataCell>
                <DateInput
                    erLesevisning={vilkårperiode?.kilde === KildeVilkårsperiode.SYSTEM}
                    label={'Fra'}
                    hideLabel
                    value={periodeForm?.fom}
                    onChange={(dato) => oppdaterPeriode('fom', dato || '')}
                    size="small"
                    feil={periodeFeil?.fom}
                />
            </Table.DataCell>
            <Table.DataCell>
                <DateInput
                    erLesevisning={vilkårperiode?.kilde === KildeVilkårsperiode.SYSTEM}
                    label={'Til'}
                    hideLabel
                    value={periodeForm?.tom}
                    onChange={(dato) => oppdaterPeriode('tom', dato || '')}
                    size="small"
                    feil={periodeFeil?.tom}
                />
            </Table.DataCell>
            <Table.DataCell>{vilkårperiode?.kilde || KildeVilkårsperiode.MANUELL}</Table.DataCell>
            <Table.DataCell>
                <KnappeRad>
                    <Button size="small" onClick={lagre}>
                        Lagre
                    </Button>

                    <Button onClick={avbrytRedigering} variant="secondary" size="small">
                        Avbryt
                    </Button>
                </KnappeRad>
            </Table.DataCell>
        </TabellRad>
    );
};

export default EndreVilkårperiodeRad;
