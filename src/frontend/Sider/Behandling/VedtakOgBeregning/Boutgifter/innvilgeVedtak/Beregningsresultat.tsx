import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';
import '@navikt/ds-css';

import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoDato } from '../../../../../utils/dato';

const Container = styled.div`
    background-color: ${AWhite};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.4rem 2rem;
`;

interface Props {
    beregningsresultat: BeregningsresultatBoutgifter;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    return (
        <VStack gap={'8'}>
            <Container>
                <Grid>
                    <Label>Fra og med</Label>
                    <Label>Til og med</Label>
                    <Label>Merutgift</Label>
                    <Label>Stønadsbeløp</Label>
                    {beregningsresultat.perioder.map((periode, indeks) => (
                        <React.Fragment key={indeks}>
                            <BodyShort size="small">{formaterIsoDato(periode.fom)}</BodyShort>
                            <BodyShort size="small">{formaterIsoDato(periode.tom)}</BodyShort>
                            <BodyShort size="small">{periode.sumUtgifter}</BodyShort>
                            <BodyShort size="small">{periode.stønadsbeløp}</BodyShort>
                        </React.Fragment>
                    ))}
                </Grid>
            </Container>
        </VStack>
    );
};

export default Beregningsresultat;
