import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Heading } from '@navikt/ds-react';

import EndreVurderingComponent from './EndreVurderingComponent';
import { Regler } from '../../../typer/regel';
import { SvarPåVilkårsvurdering, Vilkår } from '../vilkår';

const TittelOgKnappContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

interface Props {
    vilkår: Vilkår;
    feilmelding: string | undefined;
    regler: Regler;
}

const EndreVurdering: FC<Props> = ({ vilkår, feilmelding, regler }) => {
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const oppdaterVurdering = (vurdering: SvarPåVilkårsvurdering) => {
        if (!oppdatererVurdering) {
            settOppdatererVurdering(true);
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
                oppdaterVurdering={oppdaterVurdering}
                vilkårType={vilkår.vilkårtype}
                regler={regler}
                vilkår={vilkår}
            />
        </>
    );
};
export default EndreVurdering;
