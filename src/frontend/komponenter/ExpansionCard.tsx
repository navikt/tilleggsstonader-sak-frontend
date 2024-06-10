import React from 'react';

import styled from 'styled-components';

import { ExpansionCard as AkselExpansionCard } from '@navikt/ds-react';

const StyledExpansionCard = styled(AkselExpansionCard)<{ maxwidth: number }>`
    --ac-expansioncard-bg: inherit;
    max-width: ${({ maxwidth }) => maxwidth}px;
`;

const ExpansionCard: React.FC<{ tittel: string; maxWidth: number; children: React.ReactNode }> = ({
    tittel,
    maxWidth,
    children,
}) => {
    return (
        <StyledExpansionCard
            aria-labelledby={tittel}
            size="small"
            style={{ backgroundColor: 'inherit' }}
            maxwidth={maxWidth}
            defaultOpen
        >
            <AkselExpansionCard.Header>
                <AkselExpansionCard.Title size="small">{tittel}</AkselExpansionCard.Title>
            </AkselExpansionCard.Header>
            <AkselExpansionCard.Content>{children}</AkselExpansionCard.Content>
        </StyledExpansionCard>
    );
};

export default ExpansionCard;
