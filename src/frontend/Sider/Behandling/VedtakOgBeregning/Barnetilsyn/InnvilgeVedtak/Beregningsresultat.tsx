import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';
import '@navikt/ds-css';

import { BeregningsresultatTilsynBarn } from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { formaterTallMedTusenSkille } from '../../../../../utils/fomatering';
import { Toggle } from '../../../../../utils/toggles';
import { ReadMoreTidligsteEndring } from '../../Felles/TidligsteEndringReadmore';

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
    beregningsresultat: BeregningsresultatTilsynBarn;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    const endringsdatoUtledesAutomatisk = useFlag(Toggle.SKAL_UTLEDE_ENDRINGSDATO_AUTOMATISK);
    return (
        <>
            <VStack gap={'8'}>
                <Container>
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
                                <BodyShort size="small">
                                    {formaterTallMedTusenSkille(periode.grunnlag.utgifterTotal)}
                                </BodyShort>
                                <BodyShort size="small">{periode.dagsats}</BodyShort>
                                <BodyShort size="small">
                                    {formaterTallMedTusenSkille(periode.månedsbeløp)}
                                </BodyShort>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Container>
            </VStack>
            {endringsdatoUtledesAutomatisk && beregningsresultat.tidligsteEndring && (
                <ReadMoreTidligsteEndring tidligsteEndring={beregningsresultat.tidligsteEndring} />
            )}
        </>
    );
};

export default Beregningsresultat;
