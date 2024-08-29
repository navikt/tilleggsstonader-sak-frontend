import React, { FC, useState } from 'react';

import { EndreDelvilkår } from './EndreDelvilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { Regler } from '../../../typer/regel';
import { RessursFeilet, RessursSuksess } from '../../../typer/ressurs';
import { Delvilkår, Vilkår, Vilkårsresultat } from '../vilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    resultat: Vilkårsresultat;
    lagretDelvilkårsett: Delvilkår[];
    lagreVurdering: (
        delvilkårssett: Delvilkår[],
        komponentId: string
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
};

export const VisEllerEndreVilkår: FC<LesEllerEndreDelvilkårProps> = (props) => {
    const { erStegRedigerbart } = useSteg();

    const [redigerer, settRedigerer] = useState<boolean>(
        props.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
    );

    return erStegRedigerbart && redigerer ? (
        <EndreDelvilkår {...props} avsluttRedigering={() => settRedigerer(false)} />
    ) : (
        <LesevisningVilkår
            delvilkårsett={props.lagretDelvilkårsett}
            startRedigering={() => settRedigerer(true)}
        />
    );
};
