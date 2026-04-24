import React from 'react';

import { ExpansionCard, HStack } from '@navikt/ds-react';

import styles from './ExpansionCardXSmall.module.css';

interface Props {
    tittel: string;
    ikon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    ariaLabel?: string;
    variant?: 'default' | 'subtle';
    className?: string;
}

export const ExpansionCardXSmall: React.FC<Props> = ({
    tittel,
    ikon,
    children,
    defaultOpen = false,
    ariaLabel,
    variant = 'default',
    className,
}) => {
    const titleId = React.useId();

    return (
        <ExpansionCard
            className={`${styles.expansionCard} ${variant === 'subtle' ? styles.subtle : ''} ${className ?? ''}`}
            defaultOpen={defaultOpen}
            size="small"
            {...(ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId })}
        >
            <ExpansionCard.Header className={styles.header}>
                <HStack className={styles.headerContent} gap="space-8" align="center" wrap={false}>
                    {ikon && <div className={styles.icon}>{ikon}</div>}
                    <ExpansionCard.Title className={styles.title} id={titleId} size="small">
                        {tittel}
                    </ExpansionCard.Title>
                </HStack>
            </ExpansionCard.Header>
            <ExpansionCard.Content className={styles.content}>{children}</ExpansionCard.Content>
        </ExpansionCard>
    );
};
