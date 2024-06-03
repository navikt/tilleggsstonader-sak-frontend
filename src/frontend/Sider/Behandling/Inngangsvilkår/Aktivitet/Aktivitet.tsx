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
import { paragraflenkerAktivitet, rundskrivAktivitet } from '../../lenker';
import RegisterAktiviteter from '../RegisterAktivteter';
import { RegisterAktivteter } from '../typer/vilkårperiode';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

const Aktivitet: React.FC<{ grunnlag: RegisterAktivteter | undefined }> = ({ grunnlag }) => {
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();
    const { aktiviteter } = useInngangsvilkår();
    const { erStegRedigerbart } = useSteg();

    const [radIRedigeringsmodus, settRadIRedigeringsmodus] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();
    const { leggerTilNyAktivitet, settLeggerTilNyAktivitet } = useInngangsvilkår();

    const fjernRadIRedigeringsmodus = () => {
        settFeilmelding(undefined);
        settRadIRedigeringsmodus(undefined);
        settLeggerTilNyAktivitet(false);
        nullstillUlagretKomponent(UlagretKomponent.AKTIVITET);
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
            <RegisterAktiviteter aktivitetGrunnlag={grunnlag} />

            <Label>Aktivitet knyttet til behandling</Label>
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
                    onClick={() => {
                        settLeggerTilNyAktivitet((prevState) => !prevState);
                        settUlagretKomponent(UlagretKomponent.AKTIVITET);
                    }}
                    size="xsmall"
                    style={{ maxWidth: 'fit-content' }}
                    variant="secondary"
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny aktivitet
                </Button>
            )}
        </VilkårPanel>
    );
};

export default Aktivitet;
