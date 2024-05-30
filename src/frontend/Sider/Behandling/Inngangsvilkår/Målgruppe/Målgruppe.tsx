import React, { useState } from 'react';

import { CardIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import EndreMålgruppeRad from './EndreMålgruppeRad';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { paragraflenkerMålgruppe, rundskrivMålgruppe } from '../../lenker';
import VilkårperiodeRad from '../Vilkårperioder/VilkårperiodeRad';

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
            ikon={<CardIcon />}
            tittel="Målgruppe"
            paragraflenker={paragraflenkerMålgruppe}
            rundskrivlenke={rundskrivMålgruppe}
        >
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
                    onClick={() => settLeggerTilNyPeriode(true)}
                    size="xsmall"
                    style={{ maxWidth: 'fit-content' }}
                    variant="secondary"
                    icon={<PlusCircleIcon />}
                >
                    Legg til ny målgruppe
                </Button>
            )}
        </VilkårPanel>
    );
};

export default Målgruppe;
