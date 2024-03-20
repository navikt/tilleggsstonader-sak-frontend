import React, { FC, useState } from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import EndreDelvilkår from './EndreDelvilkår';
import { useBehandling } from '../../../context/BehandlingContext';
import { LagreVilkårsvurdering, useVilkår } from '../../../context/VilkårContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { Vilkår, Vilkårsvurdering } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
}

const EndreVilkår: FC<Props> = ({ vilkår, feilmelding }) => {
    const { hentBehandling } = useBehandling();
    const [oppdatererVilkår, settOppdatererVilkår] = useState<boolean>(false);

    const { lagreVilkårsvurdering } = useVilkår();

    const oppdaterVilkårsvurdering = (vurdering: LagreVilkårsvurdering) => {
        if (!oppdatererVilkår) {
            settOppdatererVilkår(true);
            lagreVilkårsvurdering(vurdering).then(
                (response: RessursSuksess<Vilkår> | RessursFeilet) => {
                    settOppdatererVilkår(false);
                    if (response.status === RessursStatus.SUKSESS) {
                        //settRedigeringsmodus(Redigeringsmodus.VISNING);
                        hentBehandling.rerun();
                    } /*else {
                    settNyEierModalState(ModalState.LUKKET);
                    hentAnsvarligSaksbehandler.rerun();
                }*/
                }
            );
        }
    };

    const lagreVilkårsvurderingFun = (vilkårsvurdering: Vilkårsvurdering) => {
        oppdaterVilkårsvurdering({
            id: vilkår.id,
            behandlingId: vilkår.behandlingId,
            vurdering: Object.entries(vilkårsvurdering).map(([regelId, delvilkårsvurdering]) => ({
                regel: regelId,
                svar: delvilkårsvurdering.svar,
                begrunnelse: delvilkårsvurdering.begrunnelse,
            })),
        });
    };

    return (
        <>
            {feilmelding && (
                <ErrorMessage size={'small'}>
                    Oppdatering av vilkår feilet: {feilmelding}
                </ErrorMessage>
            )}
            <EndreDelvilkår
                vilkårsvurdering={vilkår.vurdering}
                lagreVilkårsvurdering={lagreVilkårsvurderingFun}
            />
        </>
    );
};
export default EndreVilkår;
