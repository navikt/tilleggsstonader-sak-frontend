import React from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { ReisevurderingPrivatBil, TypeAvvikUke } from '../../../typer/kjøreliste';

const harOverlappendeKjørelisterAvvik = (reisevurderinger: ReisevurderingPrivatBil[]): boolean =>
    reisevurderinger.some((reisevurdering) =>
        reisevurdering.uker.some((uke) =>
            uke.avvik.includes(TypeAvvikUke.OVERLAPPER_MED_ANNET_RAMMEVEDTAK)
        )
    );

export const OverlappendeKjørelisterAlert: React.FC<{
    reisevurderinger: ReisevurderingPrivatBil[];
}> = ({ reisevurderinger }) => {
    if (!harOverlappendeKjørelisterAvvik(reisevurderinger)) return null;

    return (
        <Alert variant="warning" size="small">
            <Heading size="xsmall" level="3">
                Bruker har overlappende kjørelister
            </Heading>
            Denne kjørelisten har overlappende periode med en annen kjøreliste. Sjekk hvor mange
            dager bruker er i tiltak og om dagene som dekkes i denne og andre kjørelister ikke
            overstiger dette.
        </Alert>
    );
};
