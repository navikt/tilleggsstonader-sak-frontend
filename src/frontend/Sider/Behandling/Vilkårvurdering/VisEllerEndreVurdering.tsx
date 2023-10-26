import React, { FC } from 'react';

import EndreVurdering from './EndreVurdering';
import { useVilkår } from '../../../context/VilkårContext';
import { Regler } from '../../../typer/regel';
import { Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    regler: Regler;
}

const VisEllerEndreVurdering: FC<Props> = ({ vilkår, regler }) => {
    const { feilmeldinger } = useVilkår();
    const feilmelding = feilmeldinger[vilkår.id];

    // TODO: Switch på redigeringsmodus
    return (
        <EndreVurdering
            vilkår={vilkår}
            feilmelding={feilmelding} // TODO: Legge til "|| resetFeilmelding" igjen?
            regler={regler}
        />
    );
};
export default VisEllerEndreVurdering;
