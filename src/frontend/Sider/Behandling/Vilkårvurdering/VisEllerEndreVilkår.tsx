import React, { FC } from 'react';

import EndreVilkår from './EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import { Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
}

const VisEllerEndreVilkår: FC<Props> = ({ vilkår }) => {
    const { feilmeldinger } = useVilkår();
    const feilmelding = feilmeldinger[vilkår.id];
    const { behandlingOgStegErRedigerbar } = useSteg();

    return behandlingOgStegErRedigerbar ? (
        <EndreVilkår
            vilkår={vilkår}
            feilmelding={feilmelding} // TODO: Legge til "|| resetFeilmelding" igjen?
        />
    ) : (
        <LesevisningVilkår vilkår={vilkår} />
    );
};
export default VisEllerEndreVilkår;
