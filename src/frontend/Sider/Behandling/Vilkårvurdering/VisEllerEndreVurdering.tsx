import React, { FC } from 'react';

import EndreVurdering from './EndreVurdering';
import { Regler } from '../../../typer/regel';
import { Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
    regler: Regler;
}

const VisEllerEndreVurdering: FC<Props> = ({ vilkår, feilmelding, regler }) => {
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
