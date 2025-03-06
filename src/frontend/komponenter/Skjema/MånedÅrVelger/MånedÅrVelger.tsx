import React, { DependencyList, useEffect, useRef, useState } from 'react';

import { ErrorMessage, HStack, Label, VStack } from '@navikt/ds-react';

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
    size = 'small',
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
        <VStack gap="2" className={className} style={lesevisning ? { minWidth: '140px' } : {}}>
            {label && (
                <Label size="small" htmlFor="regdatoTil">
                    {label}
                </Label>
            )}
            <HStack gap="1" wrap={false}>
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
            </HStack>
            <ErrorMessage>{feilmelding}</ErrorMessage>
        </VStack>
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
