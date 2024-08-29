import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { EndreDelvilkår } from './EndreDelvilkår';
import { lagTomtDelvilkårsett } from './utils';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Regler } from '../../../typer/regel';
import { RessursStatus } from '../../../typer/ressurs';
import { Delvilkår, Vilkårtype } from '../vilkår';

export const NyttVilkår: React.FC<{
    vilkårtype: Vilkårtype;
    vilkårsregler: Regler;
    barnId: string | undefined;
}> = ({ vilkårtype, vilkårsregler, barnId }) => {
    const { behandling } = useBehandling();
    const { lagreNyttVilkår } = useVilkår();

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

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
            avsluttRedigering={() => {}}
            lagreVurdering={async (vurderinger: Delvilkår[]) => {
                const response = await lagreNyttVilkår({
                    vilkårType: vilkårtype,
                    barnId: barnId,
                    behandlingId: behandling.id,
                    delvilkårsett: vurderinger,
                });
                if (response.status === RessursStatus.SUKSESS) {
                    settLeggerTilNyttVilkår(false);
                }
                return response;
            }}
        />
    );
};
