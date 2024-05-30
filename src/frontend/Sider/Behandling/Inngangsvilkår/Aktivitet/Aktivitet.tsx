import React, { useState } from 'react';

import { BriefcaseIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import EndreAktivitetRad from './EndreAktivitetRad';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { paragraflenkerAktivitet, rundskrivAktivitet } from '../../lenker';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

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
        <VilkårPanel
            ikon={<BriefcaseIcon />}
            tittel="Aktivitet"
            paragraflenker={paragraflenkerAktivitet}
            rundskrivlenke={rundskrivAktivitet}
        >
            <>
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
                        onClick={() => settLeggerTilNyAktivitet((prevState) => !prevState)}
                        size="xsmall"
                        style={{ maxWidth: 'fit-content' }}
                        variant="secondary"
                        icon={<PlusCircleIcon />}
                    >
                        Legg til ny aktivitet
                    </Button>
                )}
            </>
        </VilkårPanel>
    );
};

export default Aktivitet;
