import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, ToggleGroup, VStack } from '@navikt/ds-react';

import styles from './Visningskomponenter.module.css';
import { ExpansionCardXSmall } from '../../../../komponenter/ExpansionCardXSmall';
import { formaterDato } from '../../../../utils/dato';

export interface SøknadInfoSeksjonFilterValg {
    value: string;
    label: string;
    ariaLabel?: string;
    count?: number;
}

export const oppsummeringAltFilterVerdi = 'alt' as const;
export const oppsummeringAltFilterValg: SøknadInfoSeksjonFilterValg = {
    value: oppsummeringAltFilterVerdi,
    label: 'Alt innhold',
    ariaLabel: 'Vis alle opplysninger',
};

function formaterFilterLabel({ label, count }: SøknadInfoSeksjonFilterValg) {
    return count !== undefined ? `${label} (${count})` : label;
}

export const Søknadsdato: React.FC<{ dato: string | undefined }> = ({ dato }) =>
    dato && (
        <HStack gap={'space-4'}>
            <CalendarIcon />
            <BodyShort size="small">
                <strong>Søknadsdato</strong>: {formaterDato(dato)}
            </BodyShort>
        </HStack>
    );

export const SøknadInfoSeksjonFilter: React.FC<{
    ariaLabel: string;
    value: string;
    onChange: (value: string) => void;
    valg: SøknadInfoSeksjonFilterValg[];
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
                value={value}
            >
                {valg.map((filtervalg) => (
                    <ToggleGroup.Item
                        aria-label={filtervalg.ariaLabel}
                        key={filtervalg.value}
                        className={styles.toggleGroupItem}
                        value={filtervalg.value}
                    >
                        <span className={styles.toggleGroupLabel}>
                            {formaterFilterLabel(filtervalg)}
                        </span>
                    </ToggleGroup.Item>
                ))}
            </ToggleGroup>
        </div>
    );
};

export const SøknadInfoSeksjonInnholdWrapper: React.FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    if (!children) {
        return null;
    }

    return <div className={styles.seksjonInnholdWrapper}>{children}</div>;
};

export const SøknadInfoSeksjon: React.FC<{
    label: string;
    ikon: React.ReactNode;
    children?: React.ReactNode;
    variant?: 'default' | 'subtle';
}> = ({ label, ikon, children, variant = 'default' }) => {
    return (
        <section className={`${styles.seksjon} ${variant === 'subtle' ? styles.subtle : ''}`}>
            <HStack gap="space-8" align="center" wrap={false} className={styles.header}>
                <div className={styles.ikon}>{ikon}</div>
                <Heading level={'4'} size={'xsmall'}>
                    {label}
                </Heading>
            </HStack>
            <SøknadInfoSeksjonInnholdWrapper>{children}</SøknadInfoSeksjonInnholdWrapper>
        </section>
    );
};

function renderValue(value: React.ReactNode) {
    if (Array.isArray(value)) {
        if (value.length === 0) return null;

        return value.map((item, index) => (
            <BodyShort size="small" key={index}>
                {item}
            </BodyShort>
        ));
    }
    if (typeof value === 'string' || typeof value === 'number') {
        return <BodyShort size="small">{value}</BodyShort>;
    }
    return value;
}
export const SøknadInfoFelt: React.FC<{
    label: React.ReactNode;
    value: React.ReactNode;
    ikon?: React.ReactNode;
}> = ({ label, value, ikon }) => {
    const innhold = renderValue(value);

    if (!innhold) {
        return null;
    }

    return (
        <VStack gap="space-4">
            <BodyShort size="small" weight="semibold">
                {ikon} {label}
            </BodyShort>
            {innhold}
        </VStack>
    );
};

export const SøknadInfoFeltKompakt: React.FC<{
    label: React.ReactNode;
    value?: React.ReactNode;
}> = ({ label, value }) => {
    const innhold = renderValue(value);

    if (!innhold) {
        return null;
    }

    return (
        <BodyShort size="small">
            {label}: <i>{innhold}</i>
        </BodyShort>
    );
};

export const SøknadInfoEkspanderbar: React.FC<{
    tittel: string;
    ikon?: React.ReactNode;
    children: React.ReactNode;
    ariaLabel?: string;
    variant?: 'default' | 'subtle';
}> = ({ tittel, ikon, children, ariaLabel, variant = 'subtle' }) => (
    <ExpansionCardXSmall
        tittel={tittel}
        ikon={ikon}
        defaultOpen
        ariaLabel={ariaLabel}
        variant={variant}
    >
        <SøknadInfoSeksjonInnholdWrapper>{children}</SøknadInfoSeksjonInnholdWrapper>
    </ExpansionCardXSmall>
);
