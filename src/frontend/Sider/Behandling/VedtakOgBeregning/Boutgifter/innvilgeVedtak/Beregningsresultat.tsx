import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';
import '@navikt/ds-css';

import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { aktivitetTypeTilTekst } from '../../../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { målgruppeTypeTilTekst } from '../../../Inngangsvilkår/typer/vilkårperiode/målgruppe';

const Container = styled.div`
    background-color: ${AWhite};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, max-content);
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
                    <Label>Fom</Label>
                    <Label>Tom</Label>
                    <Label>Antall måneder</Label>
                    <Label>Stønadsbeløp</Label>
                    <Label>Utbetalingsdato</Label>
                    <Label>Målgruppe</Label>
                    <Label>Aktivitet</Label>
                    {beregningsresultat.perioder.map((periode, indeks) => (
                        <React.Fragment key={indeks}>
                            <BodyShort size="small">{periode.fom}</BodyShort>
                            <BodyShort size="small">{periode.tom}</BodyShort>
                            <BodyShort size="small">{periode.antallMåneder}</BodyShort>
                            <BodyShort size="small">{periode.stønadsbeløp}</BodyShort>
                            <BodyShort size="small">{periode.utbetalingsdato}</BodyShort>
                            <BodyShort size="small">
                                {målgruppeTypeTilTekst(periode.målgruppe)}
                            </BodyShort>
                            <BodyShort size="small">
                                {aktivitetTypeTilTekst(periode.aktivitet)}
                            </BodyShort>
                        </React.Fragment>
                    ))}
                </Grid>
            </Container>
        </VStack>
    );
};

export default Beregningsresultat;
