import React, { FC, useState } from 'react';

import { EndreVilkår } from './EndreVilkår/EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import { Regler } from '../../../typer/regel';
import { PeriodeStatus } from '../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkår, Vilkårsresultat } from '../vilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    vilkår: Vilkår;
};

export const VisEllerEndreVilkår: FC<LesEllerEndreDelvilkårProps> = ({ regler, vilkår }) => {
    const { erStegRedigerbart } = useSteg();
    const { lagreVilkår } = useVilkår();

    const [redigerer, settRedigerer] = useState<boolean>(
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL && !vilkår.erFremtidigUtgift
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
        <LesevisningVilkår
            vilkår={vilkår}
            skalViseRedigeringsknapp={skalViseRedigeringsknapp}
            startRedigering={() => settRedigerer(true)}
        />
    );
};
