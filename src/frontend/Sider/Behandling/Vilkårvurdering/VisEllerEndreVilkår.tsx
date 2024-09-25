import React, { FC, useState } from 'react';

import { EndreVilkår } from './EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import { Regler } from '../../../typer/regel';
import { erFør } from '../../../utils/dato';
import { Vilkår, Vilkårsresultat } from '../vilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    vilkår: Vilkår;
};

export const VisEllerEndreVilkår: FC<LesEllerEndreDelvilkårProps> = ({ regler, vilkår }) => {
    const { erStegRedigerbart } = useSteg();
    const { lagreVilkår, slettVilkår } = useVilkår();
    const { behandling, kanKunEndreTomForPeriode } = useBehandling();

    const [redigerer, settRedigerer] = useState<boolean>(
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
    );

    const kanKunEndreTom = kanKunEndreTomForPeriode(vilkår.fom, vilkår.tom);
    const helePeriodenErFørDatoenDetRevurderesFra =
        behandling.revurderFra && vilkår.tom && erFør(vilkår.tom, behandling.revurderFra);

    return erStegRedigerbart && !helePeriodenErFørDatoenDetRevurderesFra && redigerer ? (
        <EndreVilkår
            regler={regler}
            redigerbareVilkårfelter={{
                delvilkårsett: vilkår.delvilkårsett,
                fom: vilkår.fom,
                tom: vilkår.tom,
                utgift: vilkår.utgift,
            }}
            lagreVurdering={(redigerbareVilkårfelter) =>
                lagreVilkår({
                    id: vilkår.id,
                    behandlingId: vilkår.behandlingId,
                    ...redigerbareVilkårfelter,
                })
            }
            avsluttRedigering={() => settRedigerer(false)}
            kanKunEndreTom={kanKunEndreTom}
            slettVilkår={
                vilkår.opphavsvilkår
                    ? undefined
                    : () => {
                          slettVilkår(vilkår);
                      }
            }
        />
    ) : (
        <LesevisningVilkår
            vilkår={vilkår}
            skalViseRedigeringsknapp={!helePeriodenErFørDatoenDetRevurderesFra}
            startRedigering={() => settRedigerer(true)}
        />
    );
};
