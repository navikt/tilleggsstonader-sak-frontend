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
                Legg til periode
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
                Endre perioder
            </Button>
        );
    }
};

export default Aksjonsknapper;
