import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, Heading, Label } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import { BeregningsresultatTilsynBarn } from '../../../../../typer/vedtak';

const Container = styled.div`
    background-color: ${AWhite};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 1rem 2rem;
`;

interface Props {
    beregningsresultat: BeregningsresultatTilsynBarn;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => (
    <Container>
        <Heading size="xsmall">Beregning</Heading>
        <Grid>
            <Label>Periode</Label>
            <Label>Barn</Label>
            <Label>Månedlige utgifter</Label>
            <Label>Dagsats</Label>
            <Label>Stønadsbeløp</Label>
            {beregningsresultat.perioder.map((periode, indeks) => (
                <React.Fragment key={indeks}>
                    <BodyShort size="small">{periode.grunnlag.måned}</BodyShort>
                    <BodyShort size="small">{periode.grunnlag.antallBarn}</BodyShort>
                    <BodyShort size="small">{periode.grunnlag.utgifterTotal}</BodyShort>
                    <BodyShort size="small">{periode.dagsats}</BodyShort>
                    <BodyShort size="small">{periode.månedsbeløp}</BodyShort>
                </React.Fragment>
            ))}
        </Grid>
    </Container>
);

export default Beregningsresultat;
