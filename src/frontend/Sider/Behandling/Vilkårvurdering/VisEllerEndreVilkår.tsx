import React, { FC, useState } from 'react';

import { EndreVilkår } from './EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRevurderingAvPerioder } from '../../../hooks/useRevurderingAvPerioder';
import { Regler } from '../../../typer/regel';
import { Vilkår, Vilkårsresultat } from '../vilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    vilkår: Vilkår;
};

export const VisEllerEndreVilkår: FC<LesEllerEndreDelvilkårProps> = ({ regler, vilkår }) => {
    const { erStegRedigerbart } = useSteg();
    const { lagreVilkår, slettVilkår } = useVilkår();

    const [redigerer, settRedigerer] = useState<boolean>(
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
    );

    const felterSomKanEndresIPerioden = useRevurderingAvPerioder({
        periodeFom: vilkår.fom,
        periodeTom: vilkår.tom,
        nyRadLeggesTil: false,
    });

    return erStegRedigerbart && felterSomKanEndresIPerioden != 'INGEN' && redigerer ? (
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
            felterSomKanRedigeres={felterSomKanEndresIPerioden}
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
            skalViseRedigeringsknapp={felterSomKanEndresIPerioden != 'INGEN'}
            startRedigering={() => settRedigerer(true)}
        />
    );
};
