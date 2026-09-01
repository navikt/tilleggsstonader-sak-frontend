import React, { FC } from 'react';

import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import SlettVilkårModal from '../../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { VilkårReiseOppstartAvslutningHjemreise } from '../typer/vilkårReiseOppstartAvslutningHjemreise';

type EndreVilkårProps = {
    lagretVilkår: VilkårReiseOppstartAvslutningHjemreise | undefined;
    avsluttRedigering: () => void;
};

export const SlettVilkårReiseOppstartAvslutningHjemreise: FC<EndreVilkårProps> = ({
    lagretVilkår,
    avsluttRedigering,
}) => {
    const { slettVilkår } = useVilkårReiseOppstartAvslutningHjemreise();

    if (!lagretVilkår) {
        return null;
    }

    const slett = (slettetBegrunnelse: string | undefined) => {
        return slettVilkår(lagretVilkår.id, slettetBegrunnelse);
    };

    return (
        <div className={'right'}>
            <SlettVilkårModal
                vilkår={lagretVilkår}
                avsluttRedigering={avsluttRedigering}
                kanSlettesPermanent={lagretVilkår?.status === 'NY'}
                slettVilkår={slett}
                metadataLabel=""
                metadata={lagretVilkår.adresse || '-'}
            />
        </div>
    );
};
