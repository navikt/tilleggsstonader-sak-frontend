import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { Switch } from '@navikt/ds-react';

import { Toggle } from '../../../../utils/toggles';
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
    const tillaterErFremtidigUtgift = useFlag(Toggle.TILLATER_NULLVEDAK);
    if (!tillaterErFremtidigUtgift) return null;

    return (
        <>
            {vilkårtype === StønadsvilkårType.UTGIFTER_OVERNATTING && kanVæreFremtidigUtgift && (
                <StyledSwitch
                    size={'small'}
                    checked={erFremtidigUtgift}
                    onChange={(e) => oppdaterErFremtidigUtgift(e.target.checked)}
                >
                    Fremtidig utgift
                </StyledSwitch>
            )}
        </>
    );
};

export default EndreErFremtidigUtgift;
