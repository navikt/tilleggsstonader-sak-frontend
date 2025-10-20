import React, { FC } from 'react';

import SlettVilkårModal from './SlettVilkårModal';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useVilkår } from '../../../../context/VilkårContext';
import { Vilkår } from '../../vilkår';

type EndreVilkårProps = {
    lagretVilkår: Vilkår | undefined;
    avsluttRedigering: () => void;
};

export const SlettVilkår: FC<EndreVilkårProps> = ({ lagretVilkår, avsluttRedigering }) => {
    const { behandling } = useBehandling();
    const { slettVilkår } = useVilkår();

    if (!lagretVilkår) {
        return null;
    }

    const slett = (slettetBegrunnelse: string | undefined) => {
        return slettVilkår({
            id: lagretVilkår.id,
            behandlingId: behandling.id,
            kommentar: slettetBegrunnelse,
        });
    };

    const vilkårKanSlettesPermanent =
        lagretVilkår?.status === 'NY' || lagretVilkår?.erFremtidigUtgift || !lagretVilkår;

    return (
        <div className={'right'}>
            {lagretVilkår && (
                <SlettVilkårModal
                    vilkår={lagretVilkår}
                    avsluttRedigering={avsluttRedigering}
                    kanSlettesPermanent={vilkårKanSlettesPermanent}
                    slettVilkår={slett}
                    metadataLabel="Utgift"
                    metadata={lagretVilkår?.utgift || '-'}
                />
            )}
        </div>
    );
};
