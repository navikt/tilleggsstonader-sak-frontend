import React from 'react';

import { PencilIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';

const Aksjonsknapper: React.FC<{
    redigerer: boolean;
    finnesStønadsperioder: boolean;
    laster: boolean;
    avbrytRedigering: () => void;
    initierFormMedTomRad: () => void;
    startRedigering: () => void;
}> = ({
    redigerer,
    finnesStønadsperioder,
    laster,
    avbrytRedigering,
    initierFormMedTomRad,
    startRedigering,
}) => {
    if (redigerer) {
        return (
            <HStack justify="space-between">
                <HStack gap="2">
                    <Button size="small" type="submit" disabled={laster}>
                        Lagre
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
                </HStack>
                <Button
                    icon={<PlusCircleIcon />}
                    size="small"
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
            <Button
                icon={<PlusCircleIcon />}
                size="small"
                onClick={(e) => {
                    e.preventDefault();
                    initierFormMedTomRad();
                    startRedigering();
                }}
                style={{ maxWidth: 'fit-content' }}
            >
                Legg til stønadsperiode
            </Button>
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
                Endre stønadsperioder
            </Button>
        );
    }
};

export default Aksjonsknapper;
