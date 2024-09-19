import React from 'react';

import styled from 'styled-components';

import { BodyShort, Box, Label } from '@navikt/ds-react';

import { ResultatVerdi } from './ResultatVerdi';
import { SimuleringOppsummering } from './simuleringTyper';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';

const FlexRow = styled.div`
    display: flex;
    gap: 3rem;
    justify-content: space-between;
`;

const Oppsumering: React.FC<{ oppsummering: SimuleringOppsummering }> = ({ oppsummering }) => (
    <Box padding="4" borderWidth="1" borderRadius={'medium'} style={{ display: 'flex' }}>
        <FlexColumn>
            <Label>Totalt for perioden</Label>
            <FlexRow>
                <BodyShort>Feilutbetaling</BodyShort>
                <ResultatVerdi $verdi={-oppsummering.feilutbetaling}>
                    {formaterTallMedTusenSkilleEllerStrek(-oppsummering.feilutbetaling)} kr
                </ResultatVerdi>
            </FlexRow>
            <FlexRow>
                <BodyShort>Etterbetaling</BodyShort>
                <ResultatVerdi $verdi={oppsummering.etterbetaling}>
                    {formaterTallMedTusenSkilleEllerStrek(oppsummering.etterbetaling)} kr
                </ResultatVerdi>
            </FlexRow>
        </FlexColumn>
    </Box>
);

export default Oppsumering;
