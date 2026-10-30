import React from 'react';

import { HStack, Radio, RadioGroup, ReadMore } from '@navikt/ds-react';

import styles from './JaNeiVurdering.module.css';
import { SvarJaNei, svarJaNeiMapping } from '../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

export const JaNeiVurdering: React.FC<{
    label: string;
    beskrivelse?: string;
    svar: SvarJaNei | undefined | 'GAMMEL_MANGLER_DATA';
    oppdaterSvar: (svar: SvarJaNei) => void;
    svarJa?: string;
    svarNei?: string;
    feilmelding?: string;
    hjelpetekst?: React.ReactNode;
    hjelpetekstHeader?: React.ReactNode;
    readOnly?: boolean;
}> = ({
    svar,
    oppdaterSvar,
    label,
    beskrivelse,
    svarJa = svarJaNeiMapping[SvarJaNei.JA],
    svarNei = svarJaNeiMapping[SvarJaNei.NEI],
    feilmelding,
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
            description={beskrivelse}
            readOnly={readOnly}
            onChange={oppdaterSvar}
            size="small"
            error={feilmelding}
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
