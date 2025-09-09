import React, { FC, useState } from 'react';

import LesevisningVilkårDagligReise from './LesevisningVilkårDagligReise';
import { useSteg } from '../../../../context/StegContext';
import { useVilkår } from '../../../../context/VilkårContext';
import { Regler } from '../../../../typer/regel';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkår, Vilkårsresultat } from '../../vilkår';
import { EndreVilkår } from '../../Vilkårvurdering/EndreVilkår/EndreVilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    vilkår: Vilkår;
    vilkårIndex: number;
};

export const VisEllerEndreVilkårDagligReise: FC<LesEllerEndreDelvilkårProps> = ({
    regler,
    vilkår,
    vilkårIndex,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { lagreVilkår } = useVilkår();

    const [redigerer, settRedigerer] = useState<boolean>(
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
    );

    const kanVæreFremtidigUtgift =
        vilkår.status === PeriodeStatus.NY ||
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL;

    const skalViseRedigeringsknapp = erStegRedigerbart && vilkår.status !== PeriodeStatus.SLETTET;

    return erStegRedigerbart && redigerer ? (
        <EndreVilkår
            lagretVilkår={vilkår}
            regler={regler}
            redigerbareVilkårfelter={{
                delvilkårsett: vilkår.delvilkårsett,
                fom: vilkår.fom,
                tom: vilkår.tom,
                utgift: vilkår.utgift,
                erFremtidigUtgift: vilkår.erFremtidigUtgift,
                offentligTransport: vilkår.offentligTransport,
            }}
            lagreVurdering={(redigerbareVilkårfelter) =>
                lagreVilkår({
                    id: vilkår.id,
                    behandlingId: vilkår.behandlingId,
                    ...redigerbareVilkårfelter,
                })
            }
            avsluttRedigering={() => settRedigerer(false)}
            vilkårtype={vilkår.vilkårType}
            kanVæreFremtidigUtgift={kanVæreFremtidigUtgift}
        />
    ) : (
        <LesevisningVilkårDagligReise
            vilkår={vilkår}
            skalViseRedigeringsknapp={skalViseRedigeringsknapp}
            startRedigering={() => settRedigerer(true)}
            vilkårIndex={vilkårIndex}
        />
    );
};
