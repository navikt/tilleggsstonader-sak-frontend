import React, { FC, useState } from 'react';

import { EndreVilkår } from './EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { Regler } from '../../../typer/regel';
import { RessursFeilet, RessursSuksess } from '../../../typer/ressurs';
import { Vilkår, RedigerbareVilkårfelter, Vilkårsresultat } from '../vilkår';

type LesEllerEndreDelvilkårProps = {
    regler: Regler;
    resultat: Vilkårsresultat;
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    lagreVurdering: (
        redigerbareVilkårfelter: RedigerbareVilkårfelter
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
};

export const VisEllerEndreVilkår: FC<LesEllerEndreDelvilkårProps> = (props) => {
    const { erStegRedigerbart } = useSteg();

    const [redigerer, settRedigerer] = useState<boolean>(
        props.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
    );

    return erStegRedigerbart && redigerer ? (
        <EndreVilkår {...props} avsluttRedigering={() => settRedigerer(false)} />
    ) : (
        <LesevisningVilkår
            resultat={props.resultat}
            vilkårsfelter={props.redigerbareVilkårfelter}
            startRedigering={() => settRedigerer(true)}
        />
    );
};
