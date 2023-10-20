import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, Label } from '@navikt/ds-react';

import { BeregningsresultatTilsynBarn } from '../../../../../typer/vedtak';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 1rem;
`;

interface Props {
    beregningsresultat: BeregningsresultatTilsynBarn;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    return (
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
                    <BodyShort size="small">
                        {periode.grunnlag.antallDagerTotal * periode.dagsats}
                    </BodyShort>
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default Beregningsresultat;
