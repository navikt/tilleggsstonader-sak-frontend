import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';

export const HarBrukerUtgifterTilFlytting: React.FC<{
    svarHarUtgifter: SvarJaNei | undefined;
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
}> = ({ svarHarUtgifter, oppdaterSvar }) => {
    return (
        <JaNeiVurdering
            label="Har bruker nødvendige utgifter til flytting?"
            svar={svarHarUtgifter}
            oppdaterSvar={(nyttSvar: SvarJaNei) => {
                oppdaterSvar(nyttSvar);
            }}
            hjelpetekst={hjelpetekst}
            hjelpetekstHeader={'Slik vurderer du om søker har nødvendige utgifter'}
        />
    );
};

const hjelpetekst = (
    <BodyShort size={'small'} spacing>
        Personer som flytter for å kunne delta i arbeidsrettet tiltak eller godkjent utdanning anses
        normalt å ha nødvendige utgifter til flytting.
    </BodyShort>
);
