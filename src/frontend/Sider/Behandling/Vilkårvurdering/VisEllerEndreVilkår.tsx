import React, { FC } from 'react';

import EndreVilkår from './EndreVilkår';
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

    return erStegRedigerbart ? (
        <EndreVilkår vilkår={vilkår} regler={regler} />
    ) : (
        <LesevisningVilkår vilkår={vilkår} />
    );
};
export default VisEllerEndreVilkår;
