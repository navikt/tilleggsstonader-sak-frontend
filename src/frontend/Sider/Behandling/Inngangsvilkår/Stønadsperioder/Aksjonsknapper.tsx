import React from 'react';

import { PencilIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

export const Aksjonsknapper: React.FC<{
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
            <>
                <Button size="small" type="submit" disabled={laster}>
                    Lagre
                </Button>
                <Button
                    type="button"
                    disabled={laster}
                    onClick={avbrytRedigering}
                    size="small"
                    variant="tertiary"
                >
                    Avbryt
                </Button>
            </>
        );
    }

    if (!finnesStønadsperioder) {
        return (
            <LeggTilStønadsperiodeKnapp
                onClick={() => {
                    initierFormMedTomRad();
                    startRedigering();
                }}
            />
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
                type="button"
            >
                Endre stønadsperioder
            </Button>
        );
    }
};

export const LeggTilStønadsperiodeKnapp: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <Button icon={<PlusCircleIcon />} size="small" onClick={onClick}>
            Legg til stønadsperiode
        </Button>
    );
};
