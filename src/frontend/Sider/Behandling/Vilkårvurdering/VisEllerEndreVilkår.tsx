import React, { FC, useState } from 'react';

import EndreDelvilkår from './EndreDelvilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { Regler } from '../../../typer/regel';
import { Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    regler: Regler;
}

const VisEllerEndreVilkår: FC<Props> = ({ vilkår, regler }) => {
    const { erStegRedigerbart } = useSteg();

    const [redigerer, settRedigerer] = useState<boolean>(true);

    return erStegRedigerbart && redigerer ? (
        <EndreDelvilkår
            vilkår={vilkår}
            regler={regler}
            avsluttRedigering={() => settRedigerer(false)}
        />
    ) : (
        <LesevisningVilkår vilkår={vilkår} startRedigering={() => settRedigerer(true)} />
    );
};
export default VisEllerEndreVilkår;
