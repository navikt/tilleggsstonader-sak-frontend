import React from 'react';

import { PencilIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';

import SmallButton from '../../../../komponenter/Knapper/SmallButton';

const Aksjonsknapper: React.FC<{
    redigerer: boolean;
    finnesStønadsperioder: boolean;
    laster: boolean;
    avbrytRedigering: () => void;
    initierFormMedTomRad: () => void;
    startRedigering: () => void;
    foreslåPerioder: () => void;
    resetForeslåPeriodeFeilmelding: () => void;
}> = ({
    redigerer,
    finnesStønadsperioder,
    laster,
    avbrytRedigering,
    initierFormMedTomRad,
    startRedigering,
    foreslåPerioder,
    resetForeslåPeriodeFeilmelding,
}) => {
    if (redigerer) {
        return (
            <HStack gap="2" align="center">
                <Button size="small" type="submit" disabled={laster}>
                    Lagre perioder
                </Button>
                <Button
                    type="button"
                    disabled={laster}
                    onClick={avbrytRedigering}
                    size="small"
                    variant="secondary"
                >
                    Avbryt
                </Button>
                <Button
                    icon={<PlusCircleIcon />}
                    size="xsmall"
                    onClick={(e) => {
                        e.preventDefault();
                        initierFormMedTomRad();
                        startRedigering();
                    }}
                    variant="tertiary"
                >
                    Legg til periode
                </Button>
            </HStack>
        );
    }

    if (!finnesStønadsperioder) {
        return (
            <HStack gap="2">
                <SmallButton
                    icon={<PlusCircleIcon />}
                    onClick={(e) => {
                        e.preventDefault();
                        initierFormMedTomRad();
                        resetForeslåPeriodeFeilmelding();
                        startRedigering();
                    }}
                >
                    Legg til periode
                </SmallButton>
                <SmallButton
                    variant={'secondary'}
                    onClick={(e) => {
                        e.preventDefault();
                        foreslåPerioder();
                    }}
                >
                    Foreslå perioder
                </SmallButton>
            </HStack>
        );
    } else {
        return (
            <Button
                icon={<PencilIcon />}
                size="small"
                disabled={laster}
                onClick={(e) => {
                    e.preventDefault();
                    startRedigering();
                }}
                style={{ maxWidth: 'fit-content' }}
            >
                Endre perioder
            </Button>
        );
    }
};

export default Aksjonsknapper;
