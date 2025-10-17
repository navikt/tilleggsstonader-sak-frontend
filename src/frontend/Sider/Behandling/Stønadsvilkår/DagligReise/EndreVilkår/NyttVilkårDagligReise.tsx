import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { EndreVilkårDagligReise } from './EndreVilkårDagligReise';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårDagligReise } from '../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { Periode } from '../../../../../utils/periode';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise } from '../typer/vilkårDagligReise';

export const NyttVilkårDagligReise: React.FC = () => {
    const { behandling } = useBehandling();
    const { lagreNyttVilkår } = useVilkårDagligReise();
    const { erStegRedigerbart } = useSteg();

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

    if (!erStegRedigerbart) {
        return null;
    }

    const opprettVilkår = async (
        periode: Periode,
        svar: SvarVilkårDagligReise,
        fakta?: FaktaDagligReise
    ) => {
        return await lagreNyttVilkår({
            behandlingId: behandling.id,
            fom: periode.fom,
            tom: periode.tom,
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
