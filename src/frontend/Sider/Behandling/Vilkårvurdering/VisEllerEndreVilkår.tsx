import React, { FC } from 'react';

import EndreVilkår from './EndreVilkår';
import LesevisningVilkår from './LesevisningVilkår';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { Regler } from '../../../typer/regel';
import { Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    regler: Regler;
}

const VisEllerEndreVilkår: FC<Props> = ({ vilkår, regler }) => {
    const { feilmeldinger } = useVilkår();
    const feilmelding = feilmeldinger[vilkår.id];
    const { behandlingErRedigerbar, behandling } = useBehandling();

    return behandlingErRedigerbar && behandling.steg === 'VILKÅR' ? (
        <EndreVilkår
            vilkår={vilkår}
            feilmelding={feilmelding} // TODO: Legge til "|| resetFeilmelding" igjen?
            regler={regler}
        />
    ) : (
        <LesevisningVilkår vilkår={vilkår} />
    );
};
export default VisEllerEndreVilkår;
