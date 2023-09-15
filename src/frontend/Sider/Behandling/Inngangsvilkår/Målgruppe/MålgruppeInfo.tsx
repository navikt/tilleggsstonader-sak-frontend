import React from 'react';

import Informasjonsrad from '../../Vilkårspanel/Informasjonsrad';
import { InformasjonContainer } from '../../Vilkårspanel/StyledVilkårInnhold';
import { VilkårInfoIkon } from '../../Vilkårspanel/VilkårInformasjonKomponenter';

const MålgruppeInfo: React.FC = () => {
    return (
        <InformasjonContainer>
            <Informasjonsrad
                ikon={VilkårInfoIkon.REGISTER}
                label="Informasjon fra andre systemer"
                verdi="Ingen informasjon funnet"
            />
        </InformasjonContainer>
    );
};

export default MålgruppeInfo;
