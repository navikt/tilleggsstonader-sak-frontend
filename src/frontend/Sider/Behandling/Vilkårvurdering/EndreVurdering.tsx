import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Heading } from '@navikt/ds-react';

import EndreVurderingComponent from './EndreVurderingComponent';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { Regler } from '../../../typer/regel';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { SvarPåVilkår, Vilkår } from '../vilkår';

const TittelOgKnappContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
`;

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
    regler: Regler;
}

const EndreVurdering: FC<Props> = ({ vilkår, feilmelding, regler }) => {
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
            <TittelOgKnappContainer>
                <Heading size={'small'} level={'3'}>
                    Vilkår vurderes
                </Heading>
                <Button type="button" variant="tertiary" icon={<ArrowUndoIcon />} size={'small'}>
                    Avbryt
                </Button>
            </TittelOgKnappContainer>

            <EndreVurderingComponent
                oppdaterVilkår={oppdaterVilkår}
                vilkårType={vilkår.vilkårType}
                regler={regler}
                vilkår={vilkår}
            />
        </>
    );
};
export default EndreVurdering;
