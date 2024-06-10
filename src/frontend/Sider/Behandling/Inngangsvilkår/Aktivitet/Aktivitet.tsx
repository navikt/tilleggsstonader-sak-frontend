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
import { paragraflenkerAktivitet, rundskrivAktivitet } from '../../lenker';
import RegisterAktiviteter from '../RegisterAktivteter';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const Aktivitet: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({ grunnlag }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { aktiviteter } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();
    const { leggerTilNyAktivitet, settLeggerTilNyAktivitet, settAktivitetFraRegister } =
        useInngangsvilkår();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        settLeggerTilNyAktivitet(false);
        nullstillUlagretKomponent(UlagretKomponent.AKTIVITET);
        settAktivitetFraRegister(undefined);
    };

    const kanSetteNyRadIRedigeringsmodus =
        radIRedigeringsmodus === undefined && !leggerTilNyAktivitet;

    const skalViseAktiviteter = aktiviteter.length > 0 || leggerTilNyAktivitet;

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
        <VilkårPanel
            ikon={<BriefcaseIcon />}
            tittel="Aktivitet"
            paragraflenker={paragraflenkerAktivitet}
            rundskrivlenke={rundskrivAktivitet}
        >
            <FlexColumn gap={2}>
                <RegisterAktiviteter grunnlag={grunnlag} />

                <FlexColumn>
                    <Label>Aktiviteter knyttet til behandling</Label>
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
                                            startRedigering={() =>
                                                settNyRadIRedigeringsmodus(aktivitet.id)
                                            }
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
                            onClick={() => {
                                settLeggerTilNyAktivitet((prevState) => !prevState);
                                settUlagretKomponent(UlagretKomponent.AKTIVITET);
                            }}
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
