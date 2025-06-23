import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { Alert, BodyShort, Label, VStack } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';
import '@navikt/ds-css';

import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoDato } from '../../../../../utils/dato';
import { Toggle } from '../../../../../utils/toggles';

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
    gap: 0.4rem 2rem;
`;

interface Props {
    beregningsresultat: BeregningsresultatBoutgifter;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    const endringsdatoUtledesAutomatisk = useFlag(Toggle.SKAL_UTLEDE_ENDRINGSDATO_AUTOMATISK);
    return (
        <>
            <VStack gap={'8'}>
                <Container>
                    <Grid>
                        <Label>Fra og med</Label>
                        <Label>Til og med</Label>
                        <Label>Merutgift</Label>
                        <Label>Stønadsbeløp</Label>
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
                </Container>
            </VStack>
            {endringsdatoUtledesAutomatisk && beregningsresultat.beregnetFra && (
                <VStack gap="2">
                    <Label size="small">Beregnet fra første endring i revurdering:</Label>
                    <BodyShort size="small">
                        {formaterIsoDato(beregningsresultat.beregnetFra)}
                    </BodyShort>
                </VStack>
            )}
        </>
    );
};

export default Beregningsresultat;
