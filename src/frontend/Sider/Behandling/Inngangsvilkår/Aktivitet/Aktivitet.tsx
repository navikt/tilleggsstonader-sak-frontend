import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading } from '@navikt/ds-react';

import EndreAktivitetRad from './EndreAktivitetRad';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { ParagrafOgRundskrivLenker } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { paragraflenkerAktivitet, rundskrivAktivitet } from '../../lenker';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    max-width: max-content;
`;

const Aktivitet: React.FC = () => {
    const { aktiviteter } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();
    const { leggerTilNyAktivitet, settLeggerTilNyAktivitet } = useInngangsvilkår();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        settLeggerTilNyAktivitet(false);
    };

    const kanSetteNyRadIRedigeringsmodus =
        radIRedigeringsmodus === undefined && !leggerTilNyAktivitet;

    const skalViseAktiviteter = aktiviteter.length > 0 || leggerTilNyAktivitet;

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
        <Container>
            <HStack gap="8" align="center">
                <Heading size="small">Aktivitet</Heading>
                <ParagrafOgRundskrivLenker
                    paragrafLenker={paragraflenkerAktivitet}
                    rundskrivLenke={rundskrivAktivitet}
                />
            </HStack>
            {skalViseAktiviteter && (
                <>
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
                                    startRedigering={() => settNyRadIRedigeringsmodus(aktivitet.id)}
                                />
                            )}
                        </React.Fragment>
                    ))}
                    {leggerTilNyAktivitet && (
                        <EndreAktivitetRad avbrytRedigering={fjernRadIRedigeringsmodus} />
                    )}
                </>
            )}

            <Feilmelding>{feilmelding}</Feilmelding>

            {kanSetteNyRadIRedigeringsmodus && erStegRedigerbart && (
                <Button
                    onClick={() => settLeggerTilNyAktivitet((prevState) => !prevState)}
                    size="xsmall"
                    style={{ maxWidth: 'fit-content' }}
                    variant={skalViseAktiviteter ? 'tertiary' : 'primary'}
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny aktivitet
                </Button>
            )}
        </Container>
    );
};

export default Aktivitet;
