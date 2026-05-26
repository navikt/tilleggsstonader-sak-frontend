import React, { FC } from 'react';

import { useVilkårReiseTilSamling } from '../../../../../context/VilkårReiseTilSamlingContext/VilkårReiseTilSamlingContext';
import SlettVilkårModal from '../../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { VilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';

type EndreVilkårProps = {
    lagretVilkår: VilkårReiseTilSamling | undefined;
    avsluttRedigering: () => void;
};

export const SlettVilkårReiseTilSamling: FC<EndreVilkårProps> = ({
    lagretVilkår,
    avsluttRedigering,
}) => {
    const { slettVilkår } = useVilkårReiseTilSamling();

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
