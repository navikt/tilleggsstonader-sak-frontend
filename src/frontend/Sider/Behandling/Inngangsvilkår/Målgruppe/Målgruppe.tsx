import React, { useEffect, useState } from 'react';

import { styled } from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Table } from '@navikt/ds-react';

import LeggTilMålgruppe, { NyMålgruppe } from './LeggTilMålgruppe';
import { useRegler } from '../../../../hooks/useRegler';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { RessursStatus } from '../../../../typer/ressurs';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Inngangsvilkårtype, SvarPåVilkår, Vilkår, Vilkårsresultat } from '../../vilkår';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';

interface MålgruppePeriode {
    id: string;
    fom: string;
    tom: string;
    type: MålgruppeType;
    vilkår: Vilkår;
}

export enum MålgruppeType {
    AAP = 'AAP',
    AAP_FERDIG_AVKLART = 'MÅLGRUPPE_AAP_FERDIG_AVKLART',
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Målgruppe = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [perioder, settPerioder] = useState<MålgruppePeriode[]>([
        {
            id: '1',
            fom: '2023-01-01',
            tom: '2023-12-31',
            type: MålgruppeType.AAP,
            vilkår: {
                id: '90d83d8a-8b78-4856-b934-d2c238410cc0',
                behandlingId: '2fcf753a-8335-4707-9bd8-b3cfa75265ac',
                resultat: Vilkårsresultat.OPPFYLT,
                vilkårType: Inngangsvilkårtype.MÅLGRUPPE_AAP,
                barnId: undefined,
                endretAv: 'Z994230',
                endretTid: '2023-11-30T16:01:47.347',
                delvilkårsett: [],
                opphavsvilkår: undefined,
            },
        },
        {
            id: '1',
            fom: '2023-01-01',
            tom: '2023-12-31',
            type: MålgruppeType.AAP_FERDIG_AVKLART,
            vilkår: {
                id: 'e069e347-b893-4ffa-b3db-a97072895b74',
                behandlingId: 'a2623609-0869-43eb-a255-55ebb185e835',
                resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                vilkårType: Inngangsvilkårtype.MÅLGRUPPE_AAP_FERDIG_AVKLART,
                barnId: undefined,
                endretAv: 'Z994808',
                endretTid: '2023-12-01T08:56:28.749',
                delvilkårsett: [
                    {
                        resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                        vurderinger: [
                            {
                                regelId: 'NEDSATT_ARBEIDSEVNE',
                                svar: undefined,
                                begrunnelse: undefined,
                            },
                        ],
                    },
                ],
                opphavsvilkår: undefined,
            },
        },
    ]);

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    // TODO flytt en nivå opp ?
    const { regler, hentRegler } = useRegler();
    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const leggTilNyMålgruppe = (nyMålgruppe: NyMålgruppe) => {
        settSkalViseLeggTilPeriode(false);
        //settPerioder((prevState) => [...prevState, { ...nyMålgruppe, id: uuidv4() }]);
    };

    if (regler.status !== RessursStatus.SUKSESS) {
        return null;
    }

    const oppdaterVilkår = (svarPåVilkår: SvarPåVilkår) => {
        settPerioder((prevState) =>
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
                    {perioder.map((periode) => (
                        <Table.ExpandableRow
                            key={periode.id}
                            togglePlacement={'right'}
                            content={
                                <EndreVurderingComponent
                                    vilkårType={periode.vilkår.vilkårType}
                                    regler={
                                        regler.data.vilkårsregler[periode.vilkår.vilkårType].regler
                                    }
                                    vilkår={periode.vilkår}
                                    oppdaterVilkår={oppdaterVilkår}
                                />
                            }
                        >
                            <Table.DataCell width="max-content">
                                <VilkårsresultatIkon vilkårsresultat={periode.vilkår.resultat} />
                            </Table.DataCell>
                            <Table.DataCell>{periode.type}</Table.DataCell>
                            <Table.DataCell>
                                {formaterIsoPeriode(periode.fom, periode.tom)}
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
