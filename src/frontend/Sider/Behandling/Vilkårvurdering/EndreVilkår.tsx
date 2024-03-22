import React, { FC, useState } from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import EndreDelvilkår from './EndreDelvilkår';
import { mapTilOppdaterDelvilkårsvurderinger, SvarPåVilkår } from './oppdatering';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { Vilkår, Delvilkårsett } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
}

const EndreVilkår: FC<Props> = ({ vilkår, feilmelding }) => {
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
                delvilkårsett={vilkår.delvilkårsett}
                oppdaterVilkår={(nyeVurderinger: Delvilkårsett) => {
                    oppdaterVilkår({
                        id: vilkår.id,
                        behandlingId: vilkår.behandlingId,
                        vurdering: mapTilOppdaterDelvilkårsvurderinger(nyeVurderinger),
                    });
                }}
            />
        </>
    );
};

export default EndreVilkår;
