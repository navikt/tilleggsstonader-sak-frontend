import React, { useState } from 'react';

import { BriefcaseIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Label } from '@navikt/ds-react';

import EndreAktivitetRad from './EndreAktivitetRad';
import { useApp } from '../../../../context/AppContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { FlexColumn } from '../../../../komponenter/Visningskomponenter/Flex';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { paragraflenkerAktivitet, rundskrivAktivitet } from '../../lenker';
import RegisterAktiviteter from '../RegisterAktivteter';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const Aktivitet: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({ grunnlag }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { aktiviteter } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [aktivitetFraRegister, settAktivitetFraRegister] = useState<Registeraktivitet>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        nullstillUlagretKomponent(UlagretKomponent.AKTIVITET);
        settAktivitetFraRegister(undefined);
    };

    const kanSetteNyRadIRedigeringsmodus = radIRedigeringsmodus === undefined && erStegRedigerbart;

    const settNyRadIRedigeringsmodus = (id?: string, aktivitetFraRegister?: Registeraktivitet) => {
        if (kanSetteNyRadIRedigeringsmodus) {
            settFeilmelding(undefined);
            settRadIRedigeringsmodus(id || 'nyPeriode');
            settAktivitetFraRegister(aktivitetFraRegister);
            settUlagretKomponent(UlagretKomponent.AKTIVITET);
        } else {
            settFeilmelding(
                'Det er kun mulig redigere en rad om gangen. Lagre eller avbryt pågående redigering.'
            );
        }
    };

    return (
        <VilkårPanel
            ikon={<BriefcaseIcon />}
            tittel="Aktivitet"
            paragraflenker={paragraflenkerAktivitet}
            rundskrivlenke={rundskrivAktivitet}
        >
            <FlexColumn gap={2}>
                <RegisterAktiviteter
                    grunnlag={grunnlag}
                    leggTilAktivitetFraRegister={(valgtAktivitet: Registeraktivitet) =>
                        settNyRadIRedigeringsmodus(undefined, valgtAktivitet)
                    }
                />

                <FlexColumn>
                    <Label>Aktiviteter knyttet til behandling</Label>

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
                    {radIRedigeringsmodus === 'nyPeriode' && (
                        <EndreAktivitetRad
                            avbrytRedigering={fjernRadIRedigeringsmodus}
                            aktivitetFraRegister={aktivitetFraRegister}
                        />
                    )}

                    <Feilmelding>{feilmelding}</Feilmelding>

                    {kanSetteNyRadIRedigeringsmodus && erStegRedigerbart && (
                        <Button
                            onClick={() => settNyRadIRedigeringsmodus()}
                            size="xsmall"
                            style={{ maxWidth: 'fit-content' }}
                            variant="secondary"
                            icon={<PlusCircleIcon />}
                        >
                            Legg til aktivitet manuelt
                        </Button>
                    )}
                </FlexColumn>
            </FlexColumn>
        </VilkårPanel>
    );
};

export default Aktivitet;
