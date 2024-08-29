import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { EndreDelvilkår } from './EndreDelvilkår';
import { lagTomtDelvilkårsett } from './utils';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Regler } from '../../../typer/regel';
import { Delvilkår, Vilkårtype } from '../vilkår';

export const NyttVilkår: React.FC<{
    vilkårtype: Vilkårtype;
    vilkårsregler: Regler;
    barnId: string | undefined;
}> = ({ vilkårtype, vilkårsregler, barnId }) => {
    const { behandling } = useBehandling();
    const { lagreNyttVilkår } = useVilkår();
    const { erStegRedigerbart } = useSteg();

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

    const opprettVilkår = async (delvilkårssett: Delvilkår[]) => {
        return await lagreNyttVilkår({
            vilkårType: vilkårtype,
            barnId: barnId,
            behandlingId: behandling.id,
            delvilkårsett: delvilkårssett,
        });
    };

    if (!erStegRedigerbart) {
        return null;
    }

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
        <EndreDelvilkår
            regler={vilkårsregler}
            lagretDelvilkårsett={lagTomtDelvilkårsett(vilkårsregler)}
            avsluttRedigering={() => settLeggerTilNyttVilkår(false)}
            lagreVurdering={opprettVilkår}
        />
    );
};
