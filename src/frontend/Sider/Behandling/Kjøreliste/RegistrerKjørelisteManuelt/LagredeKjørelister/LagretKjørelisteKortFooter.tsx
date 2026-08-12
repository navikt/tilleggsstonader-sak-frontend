import React, { FC } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';

import { ManuellRegistreringUkeDto } from '../typer';
import { LeggTilUkerPanel } from './LeggTilUkerPanel';

interface Props {
    redigerer: boolean;
    tilgjengeligeUker: ManuellRegistreringUkeDto[];
    visLeggTilUkerPanel: boolean;
    leggTilUker: (nyeUker: ManuellRegistreringUkeDto[]) => void;
    visLeggTilUker: () => void;
    lukkLeggTilUker: () => void;
    lagre: () => void;
    avbrytRedigering: () => void;
    laster: boolean;
}

export const LagretKjørelisteKortFooter: FC<Props> = ({
    redigerer,
    tilgjengeligeUker,
    visLeggTilUkerPanel,
    leggTilUker,
    visLeggTilUker,
    lukkLeggTilUker,
    lagre,
    avbrytRedigering,
    laster,
}) => {
    if (!redigerer) {
        return null;
    }

    return (
        <HStack justify={'space-between'}>
            {tilgjengeligeUker.length > 0 &&
                (visLeggTilUkerPanel ? (
                    <LeggTilUkerPanel
                        tilgjengeligeUker={tilgjengeligeUker}
                        leggTilUker={leggTilUker}
                        lukkPanel={lukkLeggTilUker}
                    />
                ) : (
                    <Button
                        style={{ width: 'fit-content' }}
                        size="small"
                        variant="secondary"
                        icon={<PlusCircleIcon />}
                        onClick={visLeggTilUker}
                    >
                        Legg til uker
                    </Button>
                ))}
            <HStack gap="space-8" height="fit-content" style={{ alignSelf: 'self-end' }}>
                <Button size="small" onClick={lagre} loading={laster}>
                    Lagre
                </Button>
                <Button size="small" variant="tertiary" onClick={avbrytRedigering}>
                    Avbryt
                </Button>
            </HStack>
        </HStack>
    );
};
