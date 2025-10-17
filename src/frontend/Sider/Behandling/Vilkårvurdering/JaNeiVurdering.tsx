import React from 'react';

import styled from 'styled-components';

import { HStack, Radio, RadioGroup, ReadMore } from '@navikt/ds-react';
import { ABorderAction } from '@navikt/ds-tokens/dist/tokens';

import { SvarJaNei, svarJaNeiMapping } from '../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

const LesMerTekst = styled(ReadMore)`
    max-width: 28rem;
`;

const Container = styled.div<{ $erUndervilkår: boolean }>`
    border-left: ${({ $erUndervilkår }) =>
        $erUndervilkår ? `5px solid ${ABorderAction}` : 'none'};
    padding-left: ${({ $erUndervilkår }) => ($erUndervilkår ? '1rem' : '0')};
    gap: ${({ $erUndervilkår }) => ($erUndervilkår ? `5rem` : `6rem`)};
    display: flex;

    @media (max-width: 900px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

export const JaNeiVurdering: React.FC<{
    label: string;
    svar: SvarJaNei | undefined | 'GAMMEL_MANGLER_DATA';
    oppdaterSvar: (svar: SvarJaNei) => void;
    svarJa?: string;
    svarNei?: string;
    hjelpetekst?: React.ReactNode;
    hjelpetekstHeader?: React.ReactNode;
    readOnly?: boolean;
    erUndervilkår?: boolean;
}> = ({
    svar,
    oppdaterSvar,
    label,
    svarJa = svarJaNeiMapping[SvarJaNei.JA],
    svarNei = svarJaNeiMapping[SvarJaNei.NEI],
    hjelpetekst,
    hjelpetekstHeader,
    readOnly = false,
    erUndervilkår = false,
}) => {
    if (svar === 'GAMMEL_MANGLER_DATA' && readOnly) {
        return null;
    }

    return (
        <Container $erUndervilkår={erUndervilkår}>
            <RadioGroup
                value={svar || ''}
                legend={label}
                readOnly={readOnly}
                onChange={oppdaterSvar}
                size="small"
            >
                {hjelpetekst && (
                    <LesMerTekst
                        header={hjelpetekstHeader ?? 'Slik gjør du vurderingen'}
                        size={'small'}
                    >
                        {hjelpetekst}
                    </LesMerTekst>
                )}
                <HStack gap="4">
                    <Radio value={SvarJaNei.JA}>{svarJa}</Radio>
                    <Radio value={SvarJaNei.NEI}>{svarNei}</Radio>
                </HStack>
            </RadioGroup>
        </Container>
    );
};
