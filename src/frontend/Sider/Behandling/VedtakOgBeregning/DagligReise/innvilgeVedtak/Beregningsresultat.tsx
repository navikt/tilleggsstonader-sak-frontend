import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, HelpText, HStack, Label, Tag, VStack } from '@navikt/ds-react';

import { BeregningDetaljerOffentligTransport } from './BeregningDetaljerOffentligTransport';
import { BeregningsresultatDagligReise } from '../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../utils/dato';
import { BeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(9, max-content);
    gap: 0.4rem 2rem;
    align-items: end;
`;

const LabelMedMaksBredde = styled(Label)`
    max-width: 80px;
`;

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
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
                        <div />

                        {reise.perioder.map((periode, periodeIndex) => (
                            <React.Fragment key={`periode-${reiseIndex}-${periodeIndex}`}>
                                <BodyShort size="small">{formaterIsoDato(periode.fom)}</BodyShort>
                                <BodyShort size="small">{formaterIsoDato(periode.tom)}</BodyShort>
                                <BodyShort size="small">{periode.antallReisedagerPerUke}</BodyShort>
                                <BodyShort size="small">{periode.prisEnkeltbillett}</BodyShort>
                                <BodyShort size="small">{periode.prisSyvdagersbillett}</BodyShort>
                                <BodyShort size="small">{periode.pris30dagersbillett}</BodyShort>
                                <HStack gap="2" align="center">
                                    <BodyShort size="small">{periode.beløp}</BodyShort>
                                    <HelpText>
                                        <BeregningDetaljerOffentligTransport
                                            billettdetaljer={periode.billettdetaljer}
                                            priser={periode}
                                        />
                                    </HelpText>
                                </HStack>
                                <BodyShort size="small">{periode.antallReisedager}</BodyShort>
                                <div>
                                    {periode.fraTidligereVedtak && (
                                        <Tag size="xsmall" variant="info">
                                            skjules
                                        </Tag>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </Grid>
                </BeregningsresultatContainer>
            ))}
        </VStack>
    );
};
