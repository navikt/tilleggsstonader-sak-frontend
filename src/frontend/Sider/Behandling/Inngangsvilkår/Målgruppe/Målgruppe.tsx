import React, { useState } from 'react';

import { styled } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Table } from '@navikt/ds-react';

import LeggTilMålgruppe, { NyMålgruppe } from './LeggTilMålgruppe';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { ReglerForVilkår } from '../../../../typer/regel';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { SvarPåVilkår, Vilkårsresultat } from '../../vilkår';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';
import { opprettVilkårAAP, opprettVilkårAAPFerdigAvklart } from '../mockUtils';
import { MålgruppeType } from '../typer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Målgruppe: React.FC<{ regler: ReglerForVilkår }> = ({ regler }) => {
    const { målgrupper, settMålgrupper } = useInngangsvilkår();

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    const leggTilNyMålgruppe = (nyMålgruppe: NyMålgruppe) => {
        settSkalViseLeggTilPeriode(false);
        settMålgrupper((prevState) => [
            ...prevState,
            {
                ...nyMålgruppe,
                id: uuidv4(),
                vilkår:
                    nyMålgruppe.type === MålgruppeType.AAP
                        ? opprettVilkårAAP()
                        : opprettVilkårAAPFerdigAvklart(),
            },
        ]);
    };

    const oppdaterVilkår = (svarPåVilkår: SvarPåVilkår) => {
        settMålgrupper((prevState) =>
            prevState.map((periode) =>
                periode.vilkår.id === svarPåVilkår.id
                    ? {
                          ...periode,
                          vilkår: {
                              ...periode.vilkår,
                              resultat:
                                  svarPåVilkår.delvilkårsett[0].vurderinger[0].svar === 'JA'
                                      ? Vilkårsresultat.OPPFYLT
                                      : Vilkårsresultat.IKKE_OPPFYLT,
                              delvilkårsett: svarPåVilkår.delvilkårsett,
                          },
                      }
                    : periode
            )
        );
    };

    return (
        <Container>
            <Heading size="medium">Målgruppe</Heading>
            <Table>
                <Table.Header>
                    <Table.HeaderCell style={{ width: '20px' }} />
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Header>
                <Table.Body>
                    {målgrupper.map((målgruppe) => (
                        <Table.ExpandableRow
                            key={målgruppe.id}
                            togglePlacement={'right'}
                            expansionDisabled={målgruppe.vilkår.delvilkårsett.length === 0}
                            content={
                                <>
                                    <Heading size={'xsmall'}>Vilkårsvurdering</Heading>
                                    <EndreVurderingComponent
                                        vilkårType={målgruppe.vilkår.vilkårType}
                                        regler={regler[målgruppe.vilkår.vilkårType].regler}
                                        vilkår={målgruppe.vilkår}
                                        oppdaterVilkår={oppdaterVilkår}
                                    />
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
                <LeggTilMålgruppe leggTilNyMålgruppe={leggTilNyMålgruppe} />
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
