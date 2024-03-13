import React, { FC } from 'react';

import EndreVilkår from './EndreVilkår';
import { useVilkår } from '../../../context/VilkårContext';
import { Regler } from '../../../typer/regel';
import { Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    regler: Regler;
}

const VisEllerEndreVilkår: FC<Props> = ({ vilkår }) => {
    const { feilmeldinger } = useVilkår();
    const feilmelding = feilmeldinger[vilkår.id];

    // TODO: Switch på redigeringsmodus
    return (
        <EndreVilkår
            vilkår={vilkår}
            feilmelding={feilmelding} // TODO: Legge til "|| resetFeilmelding" igjen?
        />
    );
};
export default VisEllerEndreVilkår;
