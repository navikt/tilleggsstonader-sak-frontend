import React, { FC } from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, Label, VStack } from '@navikt/ds-react';

import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoDato } from '../../../../../utils/dato';
import { BeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';
import { ReadMoreTidligsteEndring } from '../../Felles/TidligsteEndringReadmore';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 0.4rem 2rem;
`;

interface Props {
    beregningsresultat: BeregningsresultatBoutgifter;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => (
    <VStack gap="4">
        <BeregningsresultatContainer>
            <Grid>
                <Label size="small">Fra og med</Label>
                <Label size="small">Til og med</Label>
                <Label size="small">Merutgift</Label>
                <Label size="small">Stønadsbeløp</Label>
                <div />
                {beregningsresultat.perioder.map((periode, indeks) => (
                    <React.Fragment key={indeks}>
                        <BodyShort size="small">{formaterIsoDato(periode.fom)}</BodyShort>
                        <BodyShort size="small">{formaterIsoDato(periode.tom)}</BodyShort>
                        <BodyShort size="small">{periode.sumUtgifter}</BodyShort>
                        <BodyShort size="small">{periode.stønadsbeløp}</BodyShort>
                        <div>
                            {periode.delAvTidligereUtbetaling && (
                                <Alert variant="info" size={'small'} inline>
                                    Treffer allerede utbetalt periode
                                </Alert>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </Grid>
        </BeregningsresultatContainer>
        {beregningsresultat.tidligsteEndring && (
            <ReadMoreTidligsteEndring tidligsteEndring={beregningsresultat.tidligsteEndring} />
        )}
    </VStack>
);

export default Beregningsresultat;
