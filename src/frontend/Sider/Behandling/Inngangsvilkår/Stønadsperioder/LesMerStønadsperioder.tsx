import React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

const månederTilbakeITid: Record<Stønadstype, number> = {
    BARNETILSYN: 3,
    LÆREMIDLER: 6,
};

export const LesMerStønadsperioder = ({ stønadstype }: { stønadstype: Stønadstype }) => {
    return (
        <ReadMore header={'Slik settes perioden'} size={'small'}>
            <BodyLong size={'small'} spacing>
                Registrer hele perioden det er overlapp mellom målgruppe og aktivitet. Maks{' '}
                {månederTilbakeITid[stønadstype]} måneder tilbake i tid, men ubegrenset fremover i
                tid. Perioden kontrolleres opp mot det du har lagt til av periode og type aktivitet
                og målgruppe.
            </BodyLong>
            <BodyLong size={'small'}>
                Du kan legge inn flere perioder hvis bruker f.eks. er i flere målgrupper mens det
                gjennomføres en aktivitet.
            </BodyLong>
        </ReadMore>
    );
};
