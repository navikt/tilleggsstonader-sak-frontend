import React from 'react';

import { BodyShort, ExpansionCard, HStack, Heading, VStack } from '@navikt/ds-react';

import styles from './Visningskomponenter.module.css';

export type InfoSeksjonLayout = 'standalone' | 'grouped';

export const OppsummeringFeltgruppe: React.FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    if (!children) {
        return null;
    }

    return <div className={styles.feltgruppe}>{children}</div>;
};

const InfoSeksjonInnhold: React.FC<{
    label: string;
    ikon: React.ReactNode;
    children?: React.ReactNode;
    layout?: InfoSeksjonLayout;
}> = ({ label, ikon, children, layout = 'standalone' }) => {
    const headerClassName = layout === 'grouped' ? styles.groupedHeader : styles.header;

    return (
        <div className={layout === 'grouped' ? styles.groupedSection : undefined}>
            <HStack gap="space-8" align="center" wrap={false} className={headerClassName}>
                <div className={styles.ikon}>{ikon}</div>
                <Heading level={'4'} size={'xsmall'}>
                    {label}
                </Heading>
            </HStack>
            <OppsummeringFeltgruppe>{children}</OppsummeringFeltgruppe>
        </div>
    );
};

export const InfoSeksjon: React.FC<{
    label: string;
    ikon: React.ReactNode;
    children?: React.ReactNode;
    variant?: 'default' | 'subtle';
    layout?: InfoSeksjonLayout;
}> = ({ label, ikon, children, variant = 'default', layout = 'standalone' }) => {
    if (layout === 'grouped') {
        return (
            <InfoSeksjonInnhold label={label} ikon={ikon} layout={layout}>
                {children}
            </InfoSeksjonInnhold>
        );
    }

    return (
        <section className={`${styles.seksjon} ${variant === 'subtle' ? styles.subtle : ''}`}>
            <InfoSeksjonInnhold label={label} ikon={ikon}>
                {children}
            </InfoSeksjonInnhold>
        </section>
    );
};

export const OppsummeringSeksjonsgruppe: React.FC<{
    children?: React.ReactNode;
    variant?: 'default' | 'subtle';
}> = ({ children, variant = 'default' }) => {
    if (!children) {
        return null;
    }

    return (
        <div className={`${styles.seksjon} ${variant === 'subtle' ? styles.subtle : ''}`}>
            <div className={styles.seksjonsgruppe}>{children}</div>
        </div>
    );
};

function renderValue(value: React.ReactNode) {
    if (typeof value === 'string' || typeof value === 'number') {
        return <BodyShort size="small">{value}</BodyShort>;
    }

    return value;
}

export const OppsummeringFelt: React.FC<{
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
}> = ({ label, value, children }) => {
    const innhold = value !== undefined ? renderValue(value) : children;

    if (!innhold) {
        return null;
    }

    return (
        <VStack gap="space-4">
            <BodyShort size="small" weight="semibold">
                {label}
            </BodyShort>
            <div className={styles.feltVerdi}>{innhold}</div>
        </VStack>
    );
};

export const OppsummeringEkspanderbarEnhet: React.FC<{
    tittel: string;
    ikon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    ariaLabel?: string;
    variant?: 'default' | 'subtle';
}> = ({ tittel, ikon, children, defaultOpen = false, ariaLabel, variant = 'default' }) => {
    const titleId = React.useId();

    return (
        <ExpansionCard
            className={`${styles.expansionCard} ${
                variant === 'subtle' ? styles.expansionCardSubtle : ''
            }`}
            defaultOpen={defaultOpen}
            size="small"
            {...(ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId })}
        >
            <ExpansionCard.Header className={styles.expansionCardHeader}>
                <HStack gap="space-8" align="center" wrap={false}>
                    {ikon && <div className={styles.ikon}>{ikon}</div>}
                    <ExpansionCard.Title id={titleId} size="small">
                        {tittel}
                    </ExpansionCard.Title>
                </HStack>
            </ExpansionCard.Header>
            <ExpansionCard.Content className={styles.expansionCardContent}>
                <OppsummeringFeltgruppe>{children}</OppsummeringFeltgruppe>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
