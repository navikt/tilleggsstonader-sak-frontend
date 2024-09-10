import React, { FC, useState } from 'react';

import { EndreVilkår } from './EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { Regler } from '../../../typer/regel';
import { RessursFeilet, RessursSuksess } from '../../../typer/ressurs';
import { Vilkår, RedigerbareVilkårfelter, Vilkårsresultat } from '../vilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    vilkår: Vilkår;
    lagreVurdering: (
        redigerbareVilkårfelter: RedigerbareVilkårfelter
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
};

export const VisEllerEndreVilkår: FC<LesEllerEndreDelvilkårProps> = ({
    regler,
    vilkår,
    lagreVurdering,
}) => {
    const { erStegRedigerbart } = useSteg();

    const [redigerer, settRedigerer] = useState<boolean>(
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
    );

    return erStegRedigerbart && redigerer ? (
        <EndreVilkår
            regler={regler}
            redigerbareVilkårfelter={{
                delvilkårsett: vilkår.delvilkårsett,
                fom: vilkår.fom,
                tom: vilkår.tom,
                utgift: vilkår.utgift,
            }}
            lagreVurdering={lagreVurdering}
            avsluttRedigering={() => settRedigerer(false)}
        />
    ) : (
        <LesevisningVilkår vilkår={vilkår} startRedigering={() => settRedigerer(true)} />
    );
};
