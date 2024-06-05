import React from 'react';

import { HStack, Radio, RadioGroup } from '@navikt/ds-react';

import { SvarJaNei, svarJaNeiMapping, Vurdering } from '../Inngangsvilkår/typer/vilkårperiode';

const JaNeiVurdering: React.FC<{
    label: string;
    vurdering?: Vurdering;
    oppdaterVurdering: (vurdering: Vurdering) => void;
    svarJa?: string;
    svarNei?: string;
    readMore?: React.ReactNode;
}> = ({
    vurdering,
    oppdaterVurdering,
    label,
    svarJa = svarJaNeiMapping[SvarJaNei.JA],
    svarNei = svarJaNeiMapping[SvarJaNei.NEI],
    readMore,
}) => {
    return (
        <RadioGroup
            value={vurdering?.svar || ''}
            legend={label}
            onChange={(e) => oppdaterVurdering({ ...vurdering, svar: e })}
            size="small"
        >
            {readMore}
            <HStack gap="4">
                <Radio value={SvarJaNei.JA}>{svarJa}</Radio>
                <Radio value={SvarJaNei.NEI}>{svarNei}</Radio>
            </HStack>
        </RadioGroup>
    );
};

export default JaNeiVurdering;
