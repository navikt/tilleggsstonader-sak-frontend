import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { EndreVilkår } from './EndreVilkår/EndreVilkår';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { useVilkår } from '../../../context/VilkårContext';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Regler } from '../../../typer/regel';
import { Delvilkår, RedigerbareVilkårfelter, StønadsvilkårType } from '../vilkår';

export const NyttVilkår: React.FC<{
    vilkårtype: StønadsvilkårType;
    vilkårsregler: Regler;
    barnId?: string;
    lagTomtDelvilkårsett: () => Delvilkår[];
}> = ({ vilkårtype, vilkårsregler, barnId, lagTomtDelvilkårsett }) => {
    const { behandling } = useBehandling();
    const { lagreNyttVilkår } = useVilkår();
    const { erStegRedigerbart } = useSteg();

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

    const opprettVilkår = async (redigerbareVilkårfelter: RedigerbareVilkårfelter) => {
        return await lagreNyttVilkår({
            vilkårType: vilkårtype,
            barnId: barnId,
            behandlingId: behandling.id,
            ...redigerbareVilkårfelter,
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
        <EndreVilkår
            regler={vilkårsregler}
            redigerbareVilkårfelter={{ delvilkårsett: lagTomtDelvilkårsett() }}
            avsluttRedigering={() => settLeggerTilNyttVilkår(false)}
            lagreVurdering={opprettVilkår}
            alleFelterKanRedigeres={true}
            slettVilkår={undefined}
            vilkårtype={vilkårtype}
            kanVæreFremtidigUtgift={true}
        />
    );
};
