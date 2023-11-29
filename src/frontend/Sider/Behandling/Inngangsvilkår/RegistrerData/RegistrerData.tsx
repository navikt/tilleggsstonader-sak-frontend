import React from 'react';

import { Vilkårsresultat } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';

const RegistrerData = () => {
    const vilkårsresultat = Vilkårsresultat.OPPFYLT; // TODO
    return (
        <Vilkårpanel tittel="Registrer data" vilkårsresultat={vilkårsresultat}>
            Hei
        </Vilkårpanel>
    );
};

export default RegistrerData;
