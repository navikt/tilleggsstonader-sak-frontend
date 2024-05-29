import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading } from '@navikt/ds-react';

import EndreAktivitetRad from './EndreAktivitetRad';
import { useApp } from '../../../../context/AppContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
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
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { aktiviteter } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const [leggerTilNyPeriode, settLeggerTilNyPeriode] = useState<boolean>(false);
    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        settLeggerTilNyPeriode(false);
        nullstillUlagretKomponent(UlagretKomponent.AKTIVITET);
    };

    const kanSetteNyRadIRedigeringsmodus =
        radIRedigeringsmodus === undefined && !leggerTilNyPeriode;

    const skalViseAktiviteter = aktiviteter.length > 0 || leggerTilNyPeriode;

    const settNyRadIRedigeringsmodus = (id: string) => {
        if (kanSetteNyRadIRedigeringsmodus) {
            settFeilmelding(undefined);
            settRadIRedigeringsmodus(id);
            settUlagretKomponent(UlagretKomponent.AKTIVITET);
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
                    {leggerTilNyPeriode && (
                        <EndreAktivitetRad avbrytRedigering={fjernRadIRedigeringsmodus} />
                    )}
                </>
            )}

            <Feilmelding>{feilmelding}</Feilmelding>

            {kanSetteNyRadIRedigeringsmodus && erStegRedigerbart && (
                <Button
                    onClick={() => {
                        settLeggerTilNyPeriode((prevState) => !prevState);
                        settUlagretKomponent(UlagretKomponent.AKTIVITET);
                    }}
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
