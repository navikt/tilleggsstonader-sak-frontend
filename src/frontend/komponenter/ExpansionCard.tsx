import React from 'react';

import styled from 'styled-components';

import { ExpansionCard as AkselExpansionCard } from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/darkside-js';

const StyledExpansionCard = styled(AkselExpansionCard)<{ maxwidth: number }>`
    max-width: ${({ maxwidth }) => maxwidth}px;
    border: 1px solid ${BorderNeutralSubtle};
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
            <AkselExpansionCard.Content style={{ overflowX: 'auto' }}>
                {children}
            </AkselExpansionCard.Content>
        </StyledExpansionCard>
    );
};

export default ExpansionCard;
