import React from 'react';

import styled from 'styled-components';

import { BodyShort, Label } from '@navikt/ds-react';
import { BgRaised } from '@navikt/ds-tokens/darkside-js';

import { UtgiftBoutgift } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../../utils/dato';

const Grid = styled.div`
    padding: 1rem;
    background-color: ${BgRaised};
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.4rem 2rem;
`;

export const UtgifterTabell: React.FC<{
    utgifter: UtgiftBoutgift[];
}> = ({ utgifter }) => {
    return (
        <Grid>
            <Label size={'small'}>Fom</Label>
            <Label size={'small'}>Tom</Label>
            <Label size={'small'}>Utgift</Label>
            <Label size={'small'}>Beløp som dekkes</Label>

            {utgifter.map((utgift) => (
                <React.Fragment key={`${utgift.fom}-${utgift.tom}`}>
                    <BodyShort size={'small'}>{formaterNullableIsoDato(utgift.fom)}</BodyShort>
                    <BodyShort size={'small'}>{formaterNullableIsoDato(utgift.tom)}</BodyShort>
                    <BodyShort size={'small'}>{utgift.utgift} kr</BodyShort>
                    <BodyShort size={'small'}>{utgift.beløpSomDekkes} kr</BodyShort>
                </React.Fragment>
            ))}
        </Grid>
    );
};
