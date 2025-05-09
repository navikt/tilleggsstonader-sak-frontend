import React, { FC, useState } from 'react';

import { EndreVilkår } from './EndreVilkår/EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRevurderingAvPerioder } from '../../../hooks/useRevurderingAvPerioder';
import { Regler } from '../../../typer/regel';
import { PeriodeStatus } from '../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkår, Vilkårsresultat } from '../vilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    vilkår: Vilkår;
};

export const VisEllerEndreVilkår: FC<LesEllerEndreDelvilkårProps> = ({ regler, vilkår }) => {
    const { erStegRedigerbart } = useSteg();
    const { lagreVilkår, slettVilkår } = useVilkår();

    const [redigerer, settRedigerer] = useState<boolean>(
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL && !vilkår.erFremtidigUtgift
    );

    const { alleFelterKanEndres, helePeriodenErLåstForEndring } = useRevurderingAvPerioder({
        periodeFom: vilkår.fom,
        periodeTom: vilkår.tom,
        nyRadLeggesTil: false,
    });

    const kanVæreFremtidigUtgift =
        vilkår.status === PeriodeStatus.NY ||
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL;

    return erStegRedigerbart && !helePeriodenErLåstForEndring && redigerer ? (
        <EndreVilkår
            regler={regler}
            redigerbareVilkårfelter={{
                delvilkårsett: vilkår.delvilkårsett,
                fom: vilkår.fom,
                tom: vilkår.tom,
                utgift: vilkår.utgift,
                erFremtidigUtgift: vilkår.erFremtidigUtgift,
            }}
            lagreVurdering={(redigerbareVilkårfelter) =>
                lagreVilkår({
                    id: vilkår.id,
                    behandlingId: vilkår.behandlingId,
                    ...redigerbareVilkårfelter,
                })
            }
            avsluttRedigering={() => settRedigerer(false)}
            alleFelterKanRedigeres={alleFelterKanEndres}
            slettVilkår={
                vilkår.status === PeriodeStatus.NY || vilkår.erFremtidigUtgift
                    ? () => {
                          slettVilkår(vilkår);
                      }
                    : undefined
            }
            vilkårtype={vilkår.vilkårType}
            kanVæreFremtidigUtgift={kanVæreFremtidigUtgift}
        />
    ) : (
        <LesevisningVilkår
            vilkår={vilkår}
            skalViseRedigeringsknapp={erStegRedigerbart && !helePeriodenErLåstForEndring}
            startRedigering={() => settRedigerer(true)}
        />
    );
};
