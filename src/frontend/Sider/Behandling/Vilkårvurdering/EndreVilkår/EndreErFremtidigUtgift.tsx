import React from 'react';

import styled from 'styled-components';

import { Switch } from '@navikt/ds-react';

import { StønadsvilkårType } from '../../vilkår';

const StyledSwitch = styled(Switch)`
    align-self: end;
`;

const EndreErFremtidigUtgift: React.FC<{
    vilkårtype: StønadsvilkårType;
    kanVæreFremtidigUtgift?: boolean;
    erFremtidigUtgift?: boolean;
    oppdaterErFremtidigUtgift: (verdi: boolean) => void;
}> = ({ vilkårtype, kanVæreFremtidigUtgift, erFremtidigUtgift, oppdaterErFremtidigUtgift }) => {
    return (
        <>
            {vilkårtype === StønadsvilkårType.UTGIFTER_OVERNATTING && kanVæreFremtidigUtgift && (
                <StyledSwitch
                    size={'small'}
                    checked={erFremtidigUtgift ?? false}
                    onChange={(e) => oppdaterErFremtidigUtgift(e.target.checked)}
                >
                    Fremtidig utgift
                </StyledSwitch>
            )}
        </>
    );
};

export default EndreErFremtidigUtgift;
