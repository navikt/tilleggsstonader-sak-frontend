import React from 'react';

import styled from 'styled-components';

import { HStack, Radio, RadioGroup, ReadMore } from '@navikt/ds-react';

import { SvarJaNei, svarJaNeiMapping, Vurdering } from '../Inngangsvilkår/typer/vilkårperiode';

const LesMerTekst = styled(ReadMore)`
    max-width: 30rem;
`;

export const JaNeiDelvilkårVurdering: React.FC<{
    label: string;
    vurdering?: Vurdering;
    oppdaterVurdering: (vurdering: Vurdering) => void;
    svarJa?: string;
    svarNei?: string;
    hjelpetekst?: string;
    readOnly?: boolean;
}> = ({
    vurdering,
    oppdaterVurdering,
    label,
    svarJa = svarJaNeiMapping[SvarJaNei.JA],
    svarNei = svarJaNeiMapping[SvarJaNei.NEI],
    hjelpetekst,
    readOnly = false,
}) => {
    return (
        <RadioGroup
            value={vurdering?.svar || ''}
            legend={label}
            readOnly={readOnly}
            onChange={(e) => oppdaterVurdering({ ...vurdering, svar: e })}
            size="small"
        >
            {hjelpetekst && (
                <LesMerTekst header={'Slik gjør du vurderingen'} size={'small'}>
                    {hjelpetekst}
                </LesMerTekst>
            )}
            <HStack gap="4">
                <Radio value={SvarJaNei.JA}>{svarJa}</Radio>
                <Radio value={SvarJaNei.NEI}>{svarNei}</Radio>
            </HStack>
        </RadioGroup>
    );
};
