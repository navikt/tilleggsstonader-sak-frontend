import React, { FC, useState } from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import EndreDelvilkår from './EndreDelvilkår';
import { LagreVilkårsvurdering, Vilkår, Vilkårsvurdering } from '../vilkår';

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
}

const EndreVilkår: FC<Props> = ({ vilkår, feilmelding }) => {
    // const { hentBehandling } = useBehandling();
    const [oppdatererVilkår, settOppdatererVilkår] = useState<boolean>(false);

    // const { lagreVilkår } = useVilkår();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const oppdaterVilkår = (svarPåVilkår: LagreVilkårsvurdering) => {
        if (!oppdatererVilkår) {
            settOppdatererVilkår(true);
            // lagreVilkår(svarPåVilkår).then((response: RessursSuksess<Vilkår> | RessursFeilet) => {
            //     settOppdatererVilkår(false);
            //     if (response.status === RessursStatus.SUKSESS) {
            //         //settRedigeringsmodus(Redigeringsmodus.VISNING);
            //         hentBehandling.rerun();
            //     } /*else {
            //         settNyEierModalState(ModalState.LUKKET);
            //         hentAnsvarligSaksbehandler.rerun();
            //     }*/
            // });
        }
    };

    const oppdaterVilkårsvurdering = (vilkårsvurdering: Vilkårsvurdering) => {
        const svarPåVilkår: LagreVilkårsvurdering = {
            id: vilkår.id,
            behandlingId: vilkår.behandlingId,
            vurdering: vilkårsvurdering,
        };
        oppdaterVilkår(svarPåVilkår);
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
                lagreVilkårsvurdering={oppdaterVilkårsvurdering}
            />
        </>
    );
};
export default EndreVilkår;
