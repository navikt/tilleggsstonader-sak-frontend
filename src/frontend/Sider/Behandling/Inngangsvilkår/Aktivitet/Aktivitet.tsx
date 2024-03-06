import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import EndreAktivitetRad from './EndreAktivitetRad';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { lovverkslenkerAktivitet, rundskrivAktivitet } from '../../lenker';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const HvitTabell = styled(Table)`
    background-color: ${AWhite};
    max-width: 750px;
`;

const Aktivitet: React.FC = () => {
    const { aktiviteter } = useInngangsvilkår();
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

    const skalViseTabell = aktiviteter.length > 0 || leggerTilNyPeriode;

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
        <VilkårPanel
            tittel="Aktivitet"
            lovverkslenker={lovverkslenkerAktivitet}
            rundskrivlenke={rundskrivAktivitet}
        >
            {skalViseTabell && (
                <HvitTabell size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell style={{ width: '20px' }} />
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Fra</Table.HeaderCell>
                            <Table.HeaderCell>Til</Table.HeaderCell>
                            <Table.HeaderCell>Aktivitetsdager</Table.HeaderCell>
                            <Table.HeaderCell>Kilde</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {aktiviteter.map((aktivitet) => (
                            <React.Fragment key={aktivitet.id}>
                                {aktivitet.id === radIRedigeringsmodus ? (
                                    <EndreAktivitetRad
                                        aktivitet={aktivitet}
                                        avbrytRedigering={fjernRadIRedigeringsmodus}
                                    />
                                ) : (
                                    <VilkårperiodeRad
                                        vilkårperiode={aktivitet}
                                        type={aktivitet.type}
                                        startRedigering={() =>
                                            settNyRadIRedigeringsmodus(aktivitet.id)
                                        }
                                        aktivitetsdager={aktivitet.aktivitetsdager}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                        {leggerTilNyPeriode && (
                            <EndreAktivitetRad avbrytRedigering={fjernRadIRedigeringsmodus} />
                        )}
                    </Table.Body>
                </HvitTabell>
            )}
            <Feilmelding>{feilmelding}</Feilmelding>
            {kanSetteNyRadIRedigeringsmodus && behandlingErRedigerbar && (
                <Button
                    onClick={() => settLeggerTilNyPeriode((prevState) => !prevState)}
                    size="small"
                    style={{ maxWidth: 'fit-content' }}
                    variant={skalViseTabell ? 'secondary' : 'primary'}
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny aktivitet
                </Button>
            )}
        </VilkårPanel>
    );
};

export default Aktivitet;
