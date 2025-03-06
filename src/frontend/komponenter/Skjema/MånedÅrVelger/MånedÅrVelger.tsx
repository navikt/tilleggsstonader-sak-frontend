import React, { DependencyList, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { ErrorMessage } from '@navikt/ds-react';

import MånedVelger from './MånedVelger';
import { Årvelger } from './ÅrVelger';

interface Props {
    className?: string;
    label?: string;
    årMånedInitiell?: string;
    onEndret: (årMåned?: string) => void;
    antallÅrTilbake: number;
    antallÅrFrem: number;
    feilmelding?: string | null;
    lesevisning?: boolean;
    disabled?: boolean;
    size?: 'medium' | 'small';
}

const DatolabelStyle = styled.label`
    margin-bottom: 0.5em;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 0.25rem;
`;

export const MånedÅrVelger: React.FC<Props> = ({
    className,
    label,
    årMånedInitiell,
    onEndret,
    antallÅrTilbake = 10,
    antallÅrFrem = 4,
    feilmelding,
    lesevisning = false,
    disabled = false,
    size,
}) => {
    const [år, settÅr] = useState(
        årMånedInitiell ? parseInt(årMånedInitiell.split('-')[0], 10) : undefined
    );
    const [måned, settMåned] = useState(
        årMånedInitiell ? årMånedInitiell.split('-')[1] : undefined
    );

    useEffectNotInitialRender(() => {
        if (år && måned) {
            onEndret(`${år}-${måned}`);
        } else {
            onEndret(undefined);
        }
    }, [år, måned]);

    return (
        <div className={className} style={lesevisning ? { minWidth: '140px' } : {}}>
            {label && <DatolabelStyle htmlFor="regdatoTil">{label}</DatolabelStyle>}
            <FlexDiv>
                <MånedVelger
                    måned={måned}
                    settMåned={settMåned}
                    lesevisning={lesevisning}
                    disabled={disabled}
                    size={size}
                />
                <Årvelger
                    år={år}
                    settÅr={settÅr}
                    antallÅrTilbake={antallÅrTilbake}
                    antallÅrFrem={antallÅrFrem}
                    lesevisning={lesevisning}
                    disabled={disabled}
                    size={size}
                />
            </FlexDiv>
            <ErrorMessage>{feilmelding}</ErrorMessage>
        </div>
    );
};

export const useEffectNotInitialRender = (func: () => void, deps?: DependencyList): void => {
    const hasRendered = useRef(false);

    useEffect(() => {
        if (hasRendered.current) func();
        else hasRendered.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
