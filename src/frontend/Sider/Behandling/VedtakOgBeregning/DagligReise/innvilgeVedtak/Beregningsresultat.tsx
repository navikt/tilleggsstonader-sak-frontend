import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, HelpText, HStack, Label, VStack } from '@navikt/ds-react';

import { BeregningDetaljerOffentligTransport } from './BeregningDetaljerOffentligTransport';
import { BeregningsresultatDagligReise } from '../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../utils/dato';
import { BeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(8, max-content);
    gap: 0.4rem 2rem;
    align-items: end;
`;

const LabelMedMaksBredde = styled(Label)`
    max-width: 80px;
`;

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    return (
        <VStack gap="4">
            <Label size="small">Beregningsresultat</Label>
            {beregningsresultat.offentligTransport?.reiser.map((reise, reiseIndex) => (
                <BeregningsresultatContainer key={`reise-${reiseIndex}`}>
                    <Grid>
                        <Label>Fra og med</Label>
                        <Label>Til og med</Label>
                        <LabelMedMaksBredde>Reisedager per uke</LabelMedMaksBredde>
                        <Label>Enkeltbillett</Label>
                        <Label>7-dagersbillett</Label>
                        <Label>30-dagersbillett</Label>
                        <Label>Stønadsbeløp</Label>
                        <Label>Ant. reisedager</Label>

                        {reise.perioder.map((periode, periodeIndex) => (
                            <React.Fragment key={`periode-${reiseIndex}-${periodeIndex}`}>
                                <BodyShort size="small">
                                    {formaterIsoDato(periode.grunnlag.fom)}
                                </BodyShort>
                                <BodyShort size="small">
                                    {formaterIsoDato(periode.grunnlag.tom)}
                                </BodyShort>
                                <BodyShort size="small">
                                    {periode.grunnlag.antallReisedagerPerUke}
                                </BodyShort>
                                <BodyShort size="small">
                                    {periode.grunnlag.prisEnkeltbillett}
                                </BodyShort>
                                <BodyShort size="small">
                                    {periode.grunnlag.prisSyvdagersbillett}
                                </BodyShort>
                                <BodyShort size="small">
                                    {periode.grunnlag.pris30dagersbillett}
                                </BodyShort>
                                <HStack gap="2" align="center">
                                    <BodyShort size="small">{periode.beløp}</BodyShort>
                                    <HelpText>
                                        <BeregningDetaljerOffentligTransport
                                            billettdetaljer={periode.billettdetaljer}
                                            grunnlag={periode.grunnlag}
                                        />
                                    </HelpText>
                                </HStack>
                                <BodyShort size="small">
                                    {periode.grunnlag.antallReisedager}
                                </BodyShort>
                            </React.Fragment>
                        ))}
                    </Grid>
                </BeregningsresultatContainer>
            ))}
        </VStack>
    );
};

export default Beregningsresultat;
