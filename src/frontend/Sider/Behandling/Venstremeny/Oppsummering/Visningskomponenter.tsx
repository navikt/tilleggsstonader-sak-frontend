import React from 'react';

import { BodyShort, ExpansionCard, Heading, HStack, ToggleGroup, VStack } from '@navikt/ds-react';

import styles from './Visningskomponenter.module.css';

export type InfoSeksjonLayout = 'standalone' | 'grouped';
export interface OppsummeringSeksjonsfilterValg {
    value: string;
    label: string;
    ariaLabel?: string;
    count?: number;
}

export const oppsummeringAltFilterVerdi = 'alt' as const;
export const oppsummeringAltFilterValg: OppsummeringSeksjonsfilterValg = {
    value: oppsummeringAltFilterVerdi,
    label: 'Alt',
    ariaLabel: 'Vis alle opplysninger',
};

function formaterFilterLabel({ label, count }: OppsummeringSeksjonsfilterValg) {
    return count !== undefined ? `${label} (${count})` : label;
}

const toggleGroupStyle = {
    width: '100%',
    gridAutoColumns: 'minmax(0, 1fr)',
} satisfies React.CSSProperties;

const toggleGroupItemStyle = {
    minWidth: 0,
} satisfies React.CSSProperties;

const toggleGroupLabelStyle = {
    display: 'block',
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
} satisfies React.CSSProperties;

export function erGyldigOppsummeringsvalg<T extends string>(
    value: string,
    gyldigeValg: readonly T[]
): value is T {
    return gyldigeValg.some((valg) => valg === value);
}

export const OppsummeringSeksjonsfilter: React.FC<{
    ariaLabel: string;
    value: string;
    onChange: (value: string) => void;
    valg: OppsummeringSeksjonsfilterValg[];
}> = ({ ariaLabel, value, onChange, valg }) => {
    if (valg.length <= 1) {
        return null;
    }

    return (
        <div className={styles.seksjonsfilter}>
            <ToggleGroup
                aria-label={ariaLabel}
                className={styles.seksjonsfilterToggleGroup}
                data-color="neutral"
                fill
                onChange={onChange}
                size="small"
                style={toggleGroupStyle}
                value={value}
            >
                {valg.map((filtervalg) => (
                    <ToggleGroup.Item
                        aria-label={filtervalg.ariaLabel}
                        key={filtervalg.value}
                        style={toggleGroupItemStyle}
                        value={filtervalg.value}
                    >
                        <span style={toggleGroupLabelStyle}>{formaterFilterLabel(filtervalg)}</span>
                    </ToggleGroup.Item>
                ))}
            </ToggleGroup>
        </div>
    );
};

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
