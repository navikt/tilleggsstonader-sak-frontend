import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { EndreVilkår } from './EndreVilkår';
import { lagTomtDelvilkårsett } from './utils';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Regler } from '../../../typer/regel';
import { Toggle } from '../../../utils/toggles';
import { RedigerbareVilkårfelter, Vilkårtype } from '../vilkår';

export const NyttVilkår: React.FC<{
    vilkårtype: Vilkårtype;
    vilkårsregler: Regler;
    barnId: string | undefined;
}> = ({ vilkårtype, vilkårsregler, barnId }) => {
    const { behandling } = useBehandling();
    const { lagreNyttVilkår } = useVilkår();
    const { erStegRedigerbart } = useSteg();
    const isEnabled = useFlag(Toggle.VILKÅR_PERIODISERING);

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

    const opprettVilkår = async (redigerbareVilkårfelter: RedigerbareVilkårfelter) => {
        return await lagreNyttVilkår({
            vilkårType: vilkårtype,
            barnId: barnId,
            behandlingId: behandling.id,
            delvilkårsett: redigerbareVilkårfelter.delvilkårsett,
        });
    };

    if (!erStegRedigerbart || !isEnabled) {
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
        <EndreVilkår
            regler={vilkårsregler}
            redigerbareVilkårfelter={{ delvilkårsett: lagTomtDelvilkårsett(vilkårsregler) }}
            avsluttRedigering={() => settLeggerTilNyttVilkår(false)}
            lagreVurdering={opprettVilkår}
        />
    );
};
