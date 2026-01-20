import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { EndreVilkårDagligReise } from './EndreVilkårDagligReise';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårDagligReise } from '../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { Periode } from '../../../../../utils/periode';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise } from '../typer/vilkårDagligReise';

export const NyttVilkårDagligReise: React.FC = () => {
    const { lagreNyttVilkår } = useVilkårDagligReise();
    const { erStegRedigerbart } = useSteg();

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

    if (!erStegRedigerbart) {
        return null;
    }

    const opprettVilkår = async (
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        svar: SvarVilkårDagligReise,
        fakta: FaktaDagligReise
    ) => {
        return await lagreNyttVilkår({
            fom: periode.fom,
            tom: periode.tom,
            adresse: adresse || '',
            reiseId: reiseId,
            svar: svar,
            fakta: fakta,
        });
    };

    if (!leggerTilNyttVilkår) {
        return (
            <SmallButton
                onClick={() => settLeggerTilNyttVilkår(true)}
                variant="secondary"
                icon={<PlusCircleIcon />}
            >
                Legg til ny periode
            </SmallButton>
        );
    }
    return (
        <EndreVilkårDagligReise
            lagre={opprettVilkår}
            avsluttRedigering={() => settLeggerTilNyttVilkår(false)}
        />
    );
};
