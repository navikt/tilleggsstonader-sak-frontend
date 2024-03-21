import React, { FC, useState } from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import EndreDelvilkår from './EndreDelvilkår';
import {
    OppdaterVilkårsvurdering,
    mapTilOppdaterDelvilkårsvurderinger,
    oppdaterVilkårsvurderinger,
} from './oppdatering';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { VurderingInput, Vilkår } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
}

const EndreVilkår: FC<Props> = ({ vilkår, feilmelding }) => {
    const { hentBehandling } = useBehandling();
    const [oppdatererVilkår, settOppdatererVilkår] = useState<boolean>(false);

    const { lagreVilkårsvurdering } = useVilkår();

    const oppdaterVilkårsvurdering = (vurdering: OppdaterVilkårsvurdering) => {
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

    return (
        <>
            {feilmelding && (
                <ErrorMessage size={'small'}>
                    Oppdatering av vilkår feilet: {feilmelding}
                </ErrorMessage>
            )}
            <EndreDelvilkår
                vilkårsvurdering={vilkår.vurdering}
                lagreVilkårsvurdering={(svarsett: VurderingInput, begrunnelser: VurderingInput) => {
                    oppdaterVilkårsvurdering({
                        id: vilkår.id,
                        behandlingId: vilkår.behandlingId,
                        vurdering: mapTilOppdaterDelvilkårsvurderinger(
                            oppdaterVilkårsvurderinger(vilkår.vurdering, svarsett, begrunnelser)
                        ),
                    });
                }}
            />
        </>
    );
};

export default EndreVilkår;
