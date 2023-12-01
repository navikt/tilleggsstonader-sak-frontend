import React, { useEffect, useState } from 'react';

import { styled } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Table } from '@navikt/ds-react';

import LeggTilAktivitet, { NyAktivitet } from './LeggTilAktivitet';
import { useRegler } from '../../../../hooks/useRegler';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { RessursStatus } from '../../../../typer/ressurs';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { Inngangsvilkårtype, SvarPåVilkår, Vilkår, Vilkårsresultat } from '../../vilkår';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';

interface AktivitetPeriode {
    id: string;
    fom: string;
    tom: string;
    type: AktivitetType;
    vilkår: Vilkår;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

function opprettVilkårTiltak(): Vilkår {
    return {
        id: 'ece4a22d-a2ce-4b06-89c5-9475aaafbe52',
        behandlingId: 'a2623609-0869-43eb-a255-55ebb185e835',
        resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
        vilkårType: Inngangsvilkårtype.AKTIVITET_TILTAK,
        barnId: undefined,
        endretAv: 'Z994808',
        endretTid: '2023-12-01T09:56:31.631',
        delvilkårsett: [
            {
                resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                vurderinger: [
                    {
                        regelId: 'LØNN_GJENNOM_TILTAK',
                        svar: undefined,
                        begrunnelse: undefined,
                    },
                ],
            },
            {
                resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                vurderinger: [
                    {
                        regelId: 'MOTTAR_SYKEPENGER_GJENNOM_AKTIVITET',
                        svar: undefined,
                        begrunnelse: undefined,
                    },
                ],
            },
        ],
        opphavsvilkår: undefined,
    };
}

const Aktivitet = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [perioder, settPerioder] = useState<AktivitetPeriode[]>([
        {
            id: '1',
            fom: '2023-01-01',
            tom: '2023-12-31',
            type: AktivitetType.TILTAK,
            vilkår: opprettVilkårTiltak(),
        },
    ]);

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    // TODO flytt en nivå opp ?
    const { regler, hentRegler } = useRegler();
    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const leggTilNyAktivitet = (nyAktivitet: NyAktivitet) => {
        settSkalViseLeggTilPeriode(false);
        settPerioder((prevState) => [
            ...prevState,
            {
                ...nyAktivitet,
                id: uuidv4(),
                vilkår: opprettVilkårTiltak(),
            },
        ]);
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
                                  svarPåVilkår.delvilkårsett[0].vurderinger[0].svar === 'NEI'
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
            <Heading size="medium">Aktivitet</Heading>
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
                            expansionDisabled={periode.vilkår.delvilkårsett.length === 0}
                            content={
                                <>
                                    <Heading size={'xsmall'}>Vilkårsvurdering</Heading>
                                    <EndreVurderingComponent
                                        vilkårType={periode.vilkår.vilkårType}
                                        regler={
                                            regler.data.vilkårsregler[periode.vilkår.vilkårType]
                                                .regler
                                        }
                                        vilkår={periode.vilkår}
                                        oppdaterVilkår={oppdaterVilkår}
                                    />
                                </>
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
