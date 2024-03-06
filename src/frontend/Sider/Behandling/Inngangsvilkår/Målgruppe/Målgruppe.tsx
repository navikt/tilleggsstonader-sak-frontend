import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import EndreMålgruppeRad from './EndreMålgruppeRad';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import Panel from '../../../../komponenter/Panel/Panel';
import { ParagrafOgRundskrivLenker } from '../../../../komponenter/ParagrafOgRundskrivLenker';
import { lovverkslenkerMålgruppe, rundskrivMålgruppe } from '../../lenker';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const HvitTabell = styled(Table)`
    background-color: ${AWhite};
    max-width: 750px;
`;

const Målgruppe: React.FC = () => {
    const { målgrupper } = useInngangsvilkår();
    const { behandlingErRedigerbar } = useBehandling();

    const [leggerTilNyPeriode, settLeggerTilNyPeriode] = useState<boolean>(false);
    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        settLeggerTilNyPeriode(false);
    };

    const kanSetteNyRadIRedigeringsmodus =
        radIRedigeringsmodus === undefined && !leggerTilNyPeriode;

    const skalViseTabell = målgrupper.length > 0 || leggerTilNyPeriode;

    const settNyRadIRedigeringsmodus = (id: string) => {
        if (kanSetteNyRadIRedigeringsmodus) {
            settFeilmelding(undefined);
            settRadIRedigeringsmodus(id);
        } else {
            settFeilmelding(
                'Det er kun mulig redigere en rad om gangen. Lagre eller avbryt pågående redigering.'
            );
        }
    };

    return (
        <Panel
            tittel="Målgruppe"
            ekstraHeading={
                <ParagrafOgRundskrivLenker
                    paragrafLenker={lovverkslenkerMålgruppe}
                    rundskrivLenke={rundskrivMålgruppe}
                />
            }
        >
            {skalViseTabell && (
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
                            <React.Fragment key={målgruppe.id}>
                                {målgruppe.id === radIRedigeringsmodus ? (
                                    <EndreMålgruppeRad
                                        målgruppe={målgruppe}
                                        avbrytRedigering={fjernRadIRedigeringsmodus}
                                    />
                                ) : (
                                    <VilkårperiodeRad
                                        vilkårperiode={målgruppe}
                                        type={målgruppe.type}
                                        startRedigering={() =>
                                            settNyRadIRedigeringsmodus(målgruppe.id)
                                        }
                                    />
                                )}
                            </React.Fragment>
                        ))}
                        {leggerTilNyPeriode && (
                            <EndreMålgruppeRad avbrytRedigering={fjernRadIRedigeringsmodus} />
                        )}
                    </Table.Body>
                </HvitTabell>
            )}
            <Feilmelding>{feilmelding}</Feilmelding>
            {kanSetteNyRadIRedigeringsmodus && behandlingErRedigerbar && (
                <Button
                    onClick={() => settLeggerTilNyPeriode(true)}
                    size="small"
                    style={{ maxWidth: 'fit-content' }}
                    variant={skalViseTabell ? 'secondary' : 'primary'}
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny målgruppe
                </Button>
            )}
        </Panel>
    );
};

export default Målgruppe;
