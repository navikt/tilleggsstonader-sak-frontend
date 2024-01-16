import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import LeggTilMålgruppe from './LeggTilMålgruppe';
import MålgruppeRad from './MålgruppeRad';
import VilkårPanel from '../../../../komponenter/EkspanderbartPanel/VilkårPanel';
import { lovverkslenkerMålgruppe, rundskrivMålgruppe } from '../lenker';
import { Målgruppe } from '../typer/målgruppe';

const HvitTabell = styled(Table)`
    background-color: ${AWhite};
    max-width: fit-content;
`;

const Målgruppe: React.FC<{ målgrupper: Målgruppe[] }> = ({ målgrupper }) => {
    // const { vilkårFeilmeldinger, oppdaterMålgruppeVilkårState } = useInngangsvilkår();

    const [skalViseLeggTilPeriode, settSkalViseLeggTilPeriode] = useState<boolean>(false);

    return (
        <VilkårPanel
            tittel="Målgruppe"
            paragrafLenker={lovverkslenkerMålgruppe}
            rundskrivLenke={rundskrivMålgruppe}
        >
            <HvitTabell size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ width: '20px' }} />
                        <Table.HeaderCell>Ytelse/situasjon</Table.HeaderCell>
                        <Table.HeaderCell>Fra</Table.HeaderCell>
                        <Table.HeaderCell>Til</Table.HeaderCell>
                        <Table.HeaderCell>Kilde</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {målgrupper.map((målgruppe) => (
                        <MålgruppeRad målgruppe={målgruppe} />
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
