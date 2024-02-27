import React, { FC, useState } from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import EndreDelvilkår from './EndreDelvilkår';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { Regler } from '../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { SvarPåVilkår, Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
    regler: Regler;
}

const EndreVilkår: FC<Props> = ({ vilkår, feilmelding, regler }) => {
    const { hentBehandling } = useBehandling();
    const [oppdatererVilkår, settOppdatererVilkår] = useState<boolean>(false);

    const { lagreVilkår } = useVilkår();

    const oppdaterVilkår = (svarPåVilkår: SvarPåVilkår) => {
        if (!oppdatererVilkår) {
            settOppdatererVilkår(true);
            lagreVilkår(svarPåVilkår).then((response: RessursSuksess<Vilkår> | RessursFeilet) => {
                settOppdatererVilkår(false);
                if (response.status === RessursStatus.SUKSESS) {
                    //settRedigeringsmodus(Redigeringsmodus.VISNING);
                    hentBehandling.rerun();
                } /*else {
                    settNyEierModalState(ModalState.LUKKET);
                    hentAnsvarligSaksbehandler.rerun();
                }*/
            });
        }
    };

    return (
        <>
            {feilmelding && (
                <ErrorMessage size={'small'}>
                    Oppdatering av vilkår feilet: {feilmelding}
                </ErrorMessage>
            )}
            <EndreDelvilkår
                oppdaterVilkår={oppdaterVilkår}
                vilkårType={vilkår.vilkårType}
                regler={regler}
                vilkår={vilkår}
            />
        </>
    );
};
export default EndreVilkår;
