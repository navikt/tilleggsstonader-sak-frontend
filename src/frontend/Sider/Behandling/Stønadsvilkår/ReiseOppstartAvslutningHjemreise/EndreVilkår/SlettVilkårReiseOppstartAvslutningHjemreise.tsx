import React, { FC } from 'react';

import SlettVilkårModal from '../../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import {
    erParaplyvilkår,
    SlettVilkårFunksjon,
    VilkårROAH,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

type EndreVilkårProps = {
    lagretVilkår: VilkårROAH | undefined;
    avsluttRedigering: () => void;
    slett: SlettVilkårFunksjon | undefined;
};

export const SlettVilkårReiseOppstartAvslutningHjemreise: FC<EndreVilkårProps> = ({
    lagretVilkår,
    avsluttRedigering,
    slett,
}) => {
    if (!lagretVilkår || !slett) {
        return null;
    }

    const slettLagretVilkår = (slettetBegrunnelse: string | undefined) =>
        slett(lagretVilkår.id, slettetBegrunnelse);

    return (
        <div className={'right'}>
            <SlettVilkårModal
                vilkår={lagretVilkår}
                avsluttRedigering={avsluttRedigering}
                kanSlettesPermanent={lagretVilkår?.status === 'NY'}
                slettVilkår={slettLagretVilkår}
                metadataLabel={erParaplyvilkår(lagretVilkår) ? 'Vilkår' : 'Reiseformål'}
                metadata={
                    erParaplyvilkår(lagretVilkår)
                        ? 'Midlertidig bosted'
                        : lagretVilkår.typeReiseformål
                }
            />
        </div>
    );
};
