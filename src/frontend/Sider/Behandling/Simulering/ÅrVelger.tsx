import React, { SetStateAction } from 'react';

import styled from 'styled-components';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

interface Props {
    valgtÅr: number;
    settValgtÅr: React.Dispatch<SetStateAction<number>>;
    kanVelgeForrigeÅr: boolean;
    kanVelgeNesteÅr: boolean;
}
const ÅrVelger: React.FC<Props> = ({
    valgtÅr,
    settValgtÅr,
    kanVelgeForrigeÅr,
    kanVelgeNesteÅr,
}) => {
    return (
        <Container>
            <Button
                icon={<ChevronLeftIcon />}
                variant={'tertiary'}
                disabled={!kanVelgeForrigeÅr}
                onClick={() => settValgtÅr(valgtÅr - 1)}
                size={'small'}
            />
            {valgtÅr}
            <Button
                icon={<ChevronRightIcon />}
                variant={'tertiary'}
                disabled={!kanVelgeNesteÅr}
                onClick={() => settValgtÅr(valgtÅr + 1)}
                size={'small'}
            />
        </Container>
    );
};

export default ÅrVelger;
