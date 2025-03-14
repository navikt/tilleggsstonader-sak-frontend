import React from 'react';

import styled from 'styled-components';

import { ExpansionCard as AkselExpansionCard } from '@navikt/ds-react';

const StyledExpansionCard = styled(AkselExpansionCard)<{ maxwidth: number | string }>`
    --ac-expansioncard-bg: inherit;
    max-width: ${({ maxwidth }) => (typeof maxwidth === 'string' ? maxwidth : `${maxwidth}px`)};
`;

const ExpansionCard: React.FC<{
    tittel: string;
    maxWidth: number | string;
    children: React.ReactNode;
}> = ({ tittel, maxWidth, children }) => {
    return (
        <StyledExpansionCard aria-labelledby={tittel} size="small" maxwidth={maxWidth} defaultOpen>
            <AkselExpansionCard.Header>
                <AkselExpansionCard.Title size="small">{tittel}</AkselExpansionCard.Title>
            </AkselExpansionCard.Header>
            <AkselExpansionCard.Content>{children}</AkselExpansionCard.Content>
        </StyledExpansionCard>
    );
};

export default ExpansionCard;
