import React, { useState } from 'react';

import { styled } from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Table } from '@navikt/ds-react';

import LeggTilAktivitet, { NyAktivitet } from './LeggTilAktivitet';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { ReglerForVilkår } from '../../../../typer/regel';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { SvarPåVilkår, Vilkårsresultat } from '../../vilkår';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';
import { opprettVilkårTiltak, opprettVilkårUtdanning } from '../mockUtils';
import { AktivitetType } from '../typer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Aktivitet: React.FC<{ regler: ReglerForVilkår }> = ({ regler }) => {
    const { aktiviteter, settAktiviteter } = useInngangsvilkår();

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    const leggTilNyAktivitet = (nyAktivitet: NyAktivitet) => {
        settSkalViseLeggTilPeriode(false);
        // TODO erstatt med kall til backend
        settAktiviteter((prevState) => [
            ...prevState,
            {
                ...nyAktivitet,
                vilkår:
                    nyAktivitet.type === AktivitetType.TILTAK
                        ? opprettVilkårTiltak()
                        : opprettVilkårUtdanning(),
            },
        ]);
    };

    const oppdaterVilkår = (svarPåVilkår: SvarPåVilkår) => {
        settAktiviteter((prevState) =>
            prevState.map((aktivitet) =>
                aktivitet.vilkår.id === svarPåVilkår.id
                    ? {
                          ...aktivitet,
                          vilkår: {
                              ...aktivitet.vilkår,
                              resultat:
                                  svarPåVilkår.delvilkårsett[0].vurderinger[0].svar === 'NEI'
                                      ? Vilkårsresultat.OPPFYLT
                                      : Vilkårsresultat.IKKE_OPPFYLT,
                              delvilkårsett: svarPåVilkår.delvilkårsett,
                          },
                      }
                    : aktivitet
            )
        );
    };

    return (
        <Container>
            <Heading size="medium">Aktivitet</Heading>
            <Table>
                <Table.Header>
                    <Table.HeaderCell style={{ width: '20px' }} />
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell />
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
                                        oppdaterVilkår={oppdaterVilkår}
                                    />
                                </>
                            }
                        >
                            <Table.DataCell width="max-content">
                                <VilkårsresultatIkon vilkårsresultat={aktivitet.vilkår.resultat} />
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.type}</Table.DataCell>
                            <Table.DataCell>
                                {formaterIsoPeriode(aktivitet.fom, aktivitet.tom)}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
            {skalViseLeggTilPeriode ? (
                <LeggTilAktivitet leggTilNyAktivitet={leggTilNyAktivitet} />
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
        </Container>
    );
};

export default Aktivitet;
