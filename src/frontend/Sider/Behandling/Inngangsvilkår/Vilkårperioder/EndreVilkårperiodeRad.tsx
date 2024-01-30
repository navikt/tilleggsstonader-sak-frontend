import React from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';

import { KildeIkon } from './KildeIkon';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import SelectMedOptions, { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { Periode } from '../../../../utils/periode';
import { EndreAktivitetForm } from '../Aktivitet/EndreAktivitetRad';
import { EndreMålgruppeForm } from '../Målgruppe/EndreMålgruppeRad';
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
    form: EndreMålgruppeForm | EndreAktivitetForm;
    avbrytRedigering: () => void;
    lagre: () => void;
    oppdaterPeriode: (key: keyof Periode, nyVerdi: string) => void;
    oppdaterType: (nyttvalg: string) => void;
    typeOptions: SelectOption[];
    periodeFeil?: FormErrors<Periode>;
}

const EndreVilkårperiodeRad: React.FC<Props> = ({
    vilkårperiode,
    form,
    avbrytRedigering,
    lagre,
    oppdaterPeriode,
    oppdaterType,
    typeOptions,
    periodeFeil,
}) => {
    return (
        <TabellRad>
            <Table.DataCell width="max-content">
                <VilkårsresultatIkon
                    vilkårsresultat={vilkårperiode?.resultat || VilkårPeriodeResultat.IKKE_VURDERT}
                />
            </Table.DataCell>
            <Table.DataCell>
                <SelectMedOptions
                    label="Type"
                    hideLabel
                    erLesevisning={vilkårperiode !== undefined}
                    value={form.type}
                    valg={typeOptions}
                    onChange={(e) => oppdaterType(e.target.value)}
                    size="small"
                />
            </Table.DataCell>
            <Table.DataCell>
                <DateInput
                    erLesevisning={vilkårperiode?.kilde === KildeVilkårsperiode.SYSTEM}
                    label={'Fra'}
                    hideLabel
                    value={form?.fom}
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
                    value={form?.tom}
                    onChange={(dato) => oppdaterPeriode('tom', dato || '')}
                    size="small"
                    feil={periodeFeil?.tom}
                />
            </Table.DataCell>
            <Table.DataCell>
                <KildeIkon kilde={vilkårperiode?.kilde || KildeVilkårsperiode.MANUELL} />
            </Table.DataCell>
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
