import React, { useState } from 'react';

import { styled } from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Table } from '@navikt/ds-react';

import LeggTilMålgruppe from './LeggTilMålgruppe';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { ReglerForVilkår } from '../../../../typer/regel';
import { formaterIsoPeriode } from '../../../../utils/dato';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';
import { Målgruppe } from '../typer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Målgruppe: React.FC<{ målgrupper: Målgruppe[]; regler: ReglerForVilkår }> = ({
    målgrupper,
    regler,
}) => {
    const {
        vilkårFeilmeldinger,
        oppdaterMålgruppeVilkårState,
        målgrupperader,
        oppdaterMålgrupperad,
    } = useInngangsvilkår();

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    return (
        <Container>
            <Heading size="medium">Målgruppe</Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ width: '20px' }} />
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Periode</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {målgrupper.map((målgruppe) => (
                        <Table.ExpandableRow
                            key={målgruppe.vilkår.id}
                            togglePlacement={'right'}
                            expansionDisabled={målgruppe.vilkår.delvilkårsett.length === 0}
                            open={!!målgrupperader[målgruppe.vilkår.id]}
                            onOpenChange={(open) =>
                                oppdaterMålgrupperad(målgruppe.vilkår.id, open ? 'åpen' : undefined)
                            }
                            content={
                                <>
                                    <Heading size={'xsmall'}>Vilkårsvurdering</Heading>
                                    <EndreVurderingComponent
                                        vilkårType={målgruppe.vilkår.vilkårType}
                                        regler={regler[målgruppe.vilkår.vilkårType].regler}
                                        vilkår={målgruppe.vilkår}
                                        oppdaterVilkår={oppdaterMålgruppeVilkårState}
                                    />
                                    <Feilmelding>
                                        {vilkårFeilmeldinger[målgruppe.vilkår.id]}
                                    </Feilmelding>
                                </>
                            }
                        >
                            <Table.DataCell width="max-content">
                                <VilkårsresultatIkon vilkårsresultat={målgruppe.vilkår.resultat} />
                            </Table.DataCell>
                            <Table.DataCell>{målgruppe.type}</Table.DataCell>
                            <Table.DataCell>
                                {formaterIsoPeriode(målgruppe.fom, målgruppe.tom)}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
            {skalViseLeggTilPeriode ? (
                <LeggTilMålgruppe skjulLeggTilPeriode={() => settSkalViseLeggTilPeriode(false)} />
            ) : (
                <Button
                    onClick={() => settSkalViseLeggTilPeriode((prevState) => !prevState)}
                    size="small"
                    style={{ maxWidth: 'fit-content' }}
                    variant="secondary"
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny målgruppeperiode
                </Button>
            )}
        </Container>
    );
};

export default Målgruppe;
