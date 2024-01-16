import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Table } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import LeggTilAktivitet from './LeggTilAktivitet';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import VilkårPanel from '../../../../komponenter/EkspanderbartPanel/VilkårPanel';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { ReglerForVilkår } from '../../../../typer/regel';
import { formaterIsoDato } from '../../../../utils/dato';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';
import { lovverkslenkerAktivitet, rundskrivAktivitet } from '../lenker';
import { Aktivitet } from '../typer';

const HvitTabell = styled(Table)`
    background-color: ${AWhite};
    max-width: fit-content;
`;

const Aktivitet: React.FC<{ aktiviteter: Aktivitet[]; regler: ReglerForVilkår }> = ({
    aktiviteter,
    regler,
}) => {
    const { vilkårFeilmeldinger, oppdaterAktivitetVilkårState } = useInngangsvilkår();

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    return (
        <VilkårPanel
            tittel="Aktivitet"
            paragrafLenker={lovverkslenkerAktivitet}
            rundskrivLenke={rundskrivAktivitet}
        >
            <HvitTabell size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ width: '20px' }} />
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Fra</Table.HeaderCell>
                        <Table.HeaderCell>Til</Table.HeaderCell>
                        <Table.HeaderCell>Kilde</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {aktiviteter.map((aktivitet) => (
                        <Table.ExpandableRow
                            key={aktivitet.vilkår.id}
                            togglePlacement={'right'}
                            expansionDisabled={aktivitet.vilkår.delvilkårsett.length === 0}
                            content={
                                <>
                                    <Heading size={'xsmall'}>Vilkårsvurdering</Heading>
                                    <EndreVurderingComponent
                                        vilkårType={aktivitet.vilkår.vilkårType}
                                        regler={regler[aktivitet.vilkår.vilkårType].regler}
                                        vilkår={aktivitet.vilkår}
                                        oppdaterVilkår={oppdaterAktivitetVilkårState}
                                    />
                                    <Feilmelding>
                                        {vilkårFeilmeldinger[aktivitet.vilkår.id]}
                                    </Feilmelding>
                                </>
                            }
                        >
                            <Table.DataCell width="max-content">
                                <VilkårsresultatIkon vilkårsresultat={aktivitet.vilkår.resultat} />
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.type}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(aktivitet.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(aktivitet.tom)}</Table.DataCell>
                            <Table.DataCell>Kilde</Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </HvitTabell>
            {skalViseLeggTilPeriode ? (
                <LeggTilAktivitet skjulLeggTilPeriode={() => settSkalViseLeggTilPeriode(false)} />
            ) : (
                <Button
                    onClick={() => settSkalViseLeggTilPeriode((prevState) => !prevState)}
                    size="small"
                    style={{ maxWidth: 'fit-content' }}
                    variant="secondary"
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny aktivitet
                </Button>
            )}
        </VilkårPanel>
    );
};

export default Aktivitet;
