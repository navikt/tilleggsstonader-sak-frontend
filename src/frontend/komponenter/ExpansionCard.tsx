import React from 'react';

import { ExpansionCard as AkselExpansionCard } from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/js';

import styles from './ExpansionCard.module.css';

interface Props {
    tittel: string;
    maxWidth: number;
    children: React.ReactNode;
    openByDefault?: boolean;
    beskrivelse?: React.ReactNode;
    backgroundVariant?: 'inherit' | 'default';
}

const ExpansionCard: React.FC<Props> = ({
    tittel,
    maxWidth,
    children,
    openByDefault = true,
    beskrivelse,
    backgroundVariant = 'inherit',
}) => {
    return (
        <AkselExpansionCard
            className={styles.expansionCard}
            aria-labelledby={tittel}
            size="small"
            style={
                {
                    ...(backgroundVariant === 'inherit' ? { backgroundColor: 'inherit' } : {}),
                    '--max-width': `${maxWidth}px`,
                    '--border-color': BorderNeutralSubtle,
                } as React.CSSProperties
            }
            defaultOpen={openByDefault}
        >
            <AkselExpansionCard.Header>
                <AkselExpansionCard.Title size="small">{tittel}</AkselExpansionCard.Title>
                {beskrivelse && (
                    <AkselExpansionCard.Description>{beskrivelse}</AkselExpansionCard.Description>
                )}
            </AkselExpansionCard.Header>
            <AkselExpansionCard.Content style={{ overflowX: 'auto' }}>
                {children}
            </AkselExpansionCard.Content>
        </AkselExpansionCard>
    );
};

export default ExpansionCard;
