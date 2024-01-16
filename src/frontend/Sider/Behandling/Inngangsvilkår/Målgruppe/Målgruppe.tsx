import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Link, Table } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import LeggTilMålgruppe from './LeggTilMålgruppe';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import VilkårPanel from '../../../../komponenter/Vilkår/VilkårPanel';
import { ReglerForVilkår } from '../../../../typer/regel';
import { formaterIsoPeriode } from '../../../../utils/dato';
import EndreVurderingComponent from '../../Vilkårvurdering/EndreVurderingComponent';
import { Målgruppe } from '../typer';

const HvitTabell = styled(Table)`
    background-color: ${AWhite};
`;

const Målgruppe: React.FC<{ målgrupper: Målgruppe[]; regler: ReglerForVilkår }> = ({
    målgrupper,
    regler,
}) => {
    const { vilkårFeilmeldinger, oppdaterMålgruppeVilkårState } = useInngangsvilkår();

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    return (
        <VilkårPanel
            tittel="Målgruppe"
            headerInnhold={
                <>
                    <Link variant="neutral" href="">
                        Paragraf
                    </Link>
                    <Link variant="neutral" href="">
                        Rundskriv
                    </Link>
                </>
            }
        >
            <HvitTabell size="small">
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
            </HvitTabell>
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
        </VilkårPanel>
    );
};

export default Målgruppe;
