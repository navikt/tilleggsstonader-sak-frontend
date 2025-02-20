import React from 'react';

import styled from 'styled-components';

import { BodyShort, Heading, List, VStack } from '@navikt/ds-react';

const LiteUtenMargins = styled(List)`
    ul {
        margin-block: 0;
        margin-bottom: 0;
    }
    li {
        margin-block-end: 0;
    }
`;

export const InformasjonOppfølging = () => (
    <>
        <Heading size={'medium'}>[Admin] Oppfølging</Heading>
        <VStack gap={'2'}>
            <BodyShort>Her vises behadlinger som trenger oppfølging</BodyShort>
            <BodyShort size={'small'}>
                En behandling kan ha en eller flere årsaker til oppfølging:
            </BodyShort>
            <LiteUtenMargins size={'small'}>
                <List.Item>Ingen treff mot registeret</List.Item>
                <List.Item>Fom er endret</List.Item>
                <List.Item>Tom er endret</List.Item>
                <List.Item>Feil type aktivitet</List.Item>
            </LiteUtenMargins>
            <BodyShort size={'small'}>
                Hver rad inneholder lenke til behandling. Hver rad viser kan ekspanderes for å vise
                mer detaljer om hvilke perioder som har endret seg.
            </BodyShort>
            <BodyShort size={'small'} spacing>
                Hvis du er usikker, spør på teams.
            </BodyShort>
        </VStack>
    </>
);
