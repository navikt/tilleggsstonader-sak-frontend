import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, Label } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';
import '@navikt/ds-css';

import { BeregningsresultatLæremidler } from '../../../../../typer/vedtak/vedtakLæremidler';
import { formaterIsoPeriode, formaterÅrMåned } from '../../../../../utils/dato';
import { studienivåTilTekst } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';

const Container = styled.div`
    background-color: ${AWhite};
    padding: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, max-content);
    gap: 0.4rem 2rem;
`;

export const Beregningsresultat: FC<{ beregningsresultat: BeregningsresultatLæremidler }> = ({
    beregningsresultat,
}) => (
    <Container>
        <Grid>
            <Label>Periode</Label>
            <Label>Ant. måneder</Label>
            <Label>Studienivå</Label>
            <Label>Prosent</Label>
            <Label>Månedsbeløp</Label>
            <Label>Stønadsbeløp</Label>
            <Label>Utbetalingsmåned</Label>
            {beregningsresultat.perioder.map((periode, indeks) => (
                <React.Fragment key={indeks}>
                    <BodyShort size="small">
                        {formaterIsoPeriode(periode.fom, periode.tom)}
                    </BodyShort>
                    <BodyShort size="small">{periode.antallMåneder}</BodyShort>
                    <BodyShort size="small">{studienivåTilTekst[periode.studienivå]}</BodyShort>
                    <BodyShort size="small">{periode.studieprosent}%</BodyShort>
                    <BodyShort size="small">{periode.sats}</BodyShort>
                    <BodyShort size="small">{periode.stønadsbeløp}</BodyShort>
                    <BodyShort size="small">{formaterÅrMåned(periode.utbetalingsmåned)}</BodyShort>
                </React.Fragment>
            ))}
        </Grid>
    </Container>
);

export default Beregningsresultat;
