import React from 'react';

import { ExpansionCard as AkselExpansionCard } from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/js';

import styles from './ExpansionCard.module.css';

const ExpansionCard: React.FC<{ tittel: string; maxWidth: number; children: React.ReactNode }> = ({
    tittel,
    maxWidth,
    children,
}) => {
    return (
        <AkselExpansionCard
            className={styles.expansionCard}
            aria-labelledby={tittel}
            size="small"
            style={
                {
                    backgroundColor: 'inherit',
                    '--max-width': `${maxWidth}px`,
                    '--border-color': BorderNeutralSubtle,
                } as React.CSSProperties
            }
            defaultOpen
        >
            <AkselExpansionCard.Header>
                <AkselExpansionCard.Title size="small">{tittel}</AkselExpansionCard.Title>
            </AkselExpansionCard.Header>
            <AkselExpansionCard.Content style={{ overflowX: 'auto' }}>
                {children}
            </AkselExpansionCard.Content>
        </AkselExpansionCard>
    );
};

export default ExpansionCard;
