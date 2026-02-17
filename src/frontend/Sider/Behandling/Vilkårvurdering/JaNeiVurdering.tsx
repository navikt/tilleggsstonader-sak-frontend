import React from 'react';

import { HStack, Radio, RadioGroup, ReadMore } from '@navikt/ds-react';

import styles from './JaNeiVurdering.module.css';
import { SvarJaNei, svarJaNeiMapping } from '../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

export const JaNeiVurdering: React.FC<{
    label: string;
    svar: SvarJaNei | undefined | 'GAMMEL_MANGLER_DATA';
    oppdaterSvar: (svar: SvarJaNei) => void;
    svarJa?: string;
    svarNei?: string;
    hjelpetekst?: React.ReactNode;
    hjelpetekstHeader?: React.ReactNode;
    readOnly?: boolean;
}> = ({
    svar,
    oppdaterSvar,
    label,
    svarJa = svarJaNeiMapping[SvarJaNei.JA],
    svarNei = svarJaNeiMapping[SvarJaNei.NEI],
    hjelpetekst,
    hjelpetekstHeader,
    readOnly = false,
}) => {
    if (svar === 'GAMMEL_MANGLER_DATA' && readOnly) {
        return null;
    }

    return (
        <RadioGroup
            value={svar || ''}
            legend={label}
            readOnly={readOnly}
            onChange={oppdaterSvar}
            size="small"
        >
            {hjelpetekst && (
                <ReadMore
                    className={styles.lesMerTekst}
                    header={hjelpetekstHeader ?? 'Slik gjør du vurderingen'}
                    size={'small'}
                >
                    {hjelpetekst}
                </ReadMore>
            )}
            <HStack gap="space-16">
                <Radio value={SvarJaNei.JA}>{svarJa}</Radio>
                <Radio value={SvarJaNei.NEI}>{svarNei}</Radio>
            </HStack>
        </RadioGroup>
    );
};
