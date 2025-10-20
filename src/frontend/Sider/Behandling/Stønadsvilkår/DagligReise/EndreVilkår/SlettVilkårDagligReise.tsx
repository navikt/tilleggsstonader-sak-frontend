import React, { FC } from 'react';

import { useVilkårDagligReise } from '../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import SlettVilkårModal from '../../../Vilkårvurdering/EndreVilkår/SlettVilkårModal';
import { typeDagligReiseTilTekst, VilkårDagligReise } from '../typer/vilkårDagligReise';

type EndreVilkårProps = {
    lagretVilkår: VilkårDagligReise | undefined;
    avsluttRedigering: () => void;
};

export const SlettVilkårDagligReise: FC<EndreVilkårProps> = ({
    lagretVilkår,
    avsluttRedigering,
}) => {
    const { slettVilkår } = useVilkårDagligReise();

    if (!lagretVilkår) {
        return null;
    }

    const slett = (slettetBegrunnelse: string | undefined) => {
        return slettVilkår(lagretVilkår.id, slettetBegrunnelse);
    };

    return (
        <div className={'right'}>
            {lagretVilkår && (
                <SlettVilkårModal
                    vilkår={lagretVilkår}
                    avsluttRedigering={avsluttRedigering}
                    kanSlettesPermanent={lagretVilkår?.status === 'NY'}
                    slettVilkår={slett}
                    metadataLabel="Type daglig reise"
                    metadata={
                        lagretVilkår.fakta ? typeDagligReiseTilTekst[lagretVilkår.fakta.type] : '-'
                    }
                />
            )}
        </div>
    );
};
