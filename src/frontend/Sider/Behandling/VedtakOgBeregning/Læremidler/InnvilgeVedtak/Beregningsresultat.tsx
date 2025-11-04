import React, { FC } from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, Label, VStack } from '@navikt/ds-react';

import { BeregningsresultatLæremidler } from '../../../../../typer/vedtak/vedtakLæremidler';
import { formaterIsoDato } from '../../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../../utils/fomatering';
import { studienivåTilTekst } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { BeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';
import { ReadMoreTidligsteEndring } from '../../Felles/TidligsteEndringReadmore';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(8, max-content);
    gap: 0.4rem 2rem;
`;

export const Beregningsresultat: FC<{ beregningsresultat: BeregningsresultatLæremidler }> = ({
    beregningsresultat,
}) => (
    <VStack gap="4">
        <BeregningsresultatContainer>
            <Grid>
                <Label>Fom</Label>
                <Label>Tom</Label>
                <Label>Ant. måneder</Label>
                <Label>Studienivå</Label>
                <Label>Prosent</Label>
                <Label>Månedsbeløp</Label>
                <Label>Stønadsbeløp</Label>
                <div />
                {beregningsresultat.perioder.map((periode, indeks) => (
                    <React.Fragment key={indeks}>
                        <BodyShort size="small">{formaterIsoDato(periode.fom)}</BodyShort>
                        <BodyShort size="small">{formaterIsoDato(periode.tom)}</BodyShort>
                        <BodyShort size="small">{periode.antallMåneder}</BodyShort>
                        <BodyShort size="small">{studienivåTilTekst[periode.studienivå]}</BodyShort>
                        <BodyShort size="small">{periode.studieprosent}%</BodyShort>
                        <BodyShort size="small">
                            {formaterTallMedTusenSkille(periode.stønadsbeløpPerMåned)} kr
                        </BodyShort>
                        <BodyShort size="small">
                            {formaterTallMedTusenSkille(periode.stønadsbeløpForPeriode)} kr
                        </BodyShort>
                        <div>
                            {periode.delAvTidligereUtbetaling && (
                                <Alert variant="info" size={'small'} inline>
                                    Treffer allerede utbetalt mnd
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
