import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading } from '@navikt/ds-react';

import EndreMålgruppeRad from './EndreMålgruppeRad';
import { useApp } from '../../../../context/AppContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { ParagrafOgRundskrivLenker } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { paragraflenkerMålgruppe, rundskrivMålgruppe } from '../../lenker';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    max-width: max-content;
`;

const KOMPONENT = 'målgrupper';

const Målgruppe: React.FC = () => {
    const { settIkkePersistertKomponent, nullstillIkkePersistertKomponent } = useApp();
    const { målgrupper } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const [leggerTilNyPeriode, settLeggerTilNyPeriode] = useState<boolean>(false);
    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        settLeggerTilNyPeriode(false);
        nullstillIkkePersistertKomponent(KOMPONENT);
    };

    const kanSetteNyRadIRedigeringsmodus =
        radIRedigeringsmodus === undefined && !leggerTilNyPeriode;

    const skalViseMålgrupper = målgrupper.length > 0 || leggerTilNyPeriode;

    const settNyRadIRedigeringsmodus = (id: string) => {
        if (kanSetteNyRadIRedigeringsmodus) {
            settFeilmelding(undefined);
            settRadIRedigeringsmodus(id);
            settIkkePersistertKomponent(KOMPONENT);
        } else {
            settFeilmelding(
                'Det er kun mulig redigere en rad om gangen. Lagre eller avbryt pågående redigering.'
            );
        }
    };

    return (
        <Container>
            <HStack gap="8" align="center">
                <Heading size="small">Målgruppe</Heading>
                <ParagrafOgRundskrivLenker
                    paragrafLenker={paragraflenkerMålgruppe}
                    rundskrivLenke={rundskrivMålgruppe}
                />
            </HStack>
            {skalViseMålgrupper && (
                <>
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
                </>
            )}

            <Feilmelding>{feilmelding}</Feilmelding>

            {kanSetteNyRadIRedigeringsmodus && erStegRedigerbart && (
                <Button
                    onClick={() => {
                        settLeggerTilNyPeriode(true);
                        settIkkePersistertKomponent(KOMPONENT);
                    }}
                    size="xsmall"
                    style={{ maxWidth: 'fit-content' }}
                    variant={skalViseMålgrupper ? 'tertiary' : 'primary'}
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny målgruppe
                </Button>
            )}
        </Container>
    );
};

export default Målgruppe;
