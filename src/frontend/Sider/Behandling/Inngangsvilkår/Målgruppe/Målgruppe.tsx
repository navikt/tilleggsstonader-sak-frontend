import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import EndreMålgruppeRad from './EndreMålgruppeRad';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { lovverkslenkerMålgruppe, rundskrivMålgruppe } from '../../lenker';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    max-width: max-content;
`;

const Målgruppe: React.FC = () => {
    const { målgrupper } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

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

    const skalViseMålgrupper = målgrupper.length > 0 || leggerTilNyPeriode;

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
            tittel="Målgruppe"
            paragraflenker={lovverkslenkerMålgruppe}
            rundskrivlenke={rundskrivMålgruppe}
        >
            {skalViseMålgrupper && (
                <Container>
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
                                    startRedigering={() => settNyRadIRedigeringsmodus(målgruppe.id)}
                                />
                            )}
                        </React.Fragment>
                    ))}
                    {leggerTilNyPeriode && (
                        <EndreMålgruppeRad avbrytRedigering={fjernRadIRedigeringsmodus} />
                    )}
                </Container>
            )}

            <Feilmelding>{feilmelding}</Feilmelding>

            {kanSetteNyRadIRedigeringsmodus && erStegRedigerbart && (
                <Button
                    onClick={() => settLeggerTilNyPeriode(true)}
                    size="small"
                    style={{ maxWidth: 'fit-content' }}
                    variant={skalViseMålgrupper ? 'secondary' : 'primary'}
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny målgruppe
                </Button>
            )}
        </VilkårPanel>
    );
};

export default Målgruppe;
