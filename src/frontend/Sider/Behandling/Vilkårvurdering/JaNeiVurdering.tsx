import React from 'react';

import { HStack, Radio, RadioGroup } from '@navikt/ds-react';

import { SvarJaNei, Vurdering, svarJaNeiMapping } from '../Inngangsvilkår/typer/vilkårperiode';

const JaNeiVurdering: React.FC<{
    label: string;
    vurdering?: Vurdering;
    oppdaterVurdering: (vurdering: Vurdering) => void;
    svarJa?: string;
    svarNei?: string;
}> = ({
    vurdering,
    oppdaterVurdering,
    label,
    svarJa = svarJaNeiMapping[SvarJaNei.JA],
    svarNei = svarJaNeiMapping[SvarJaNei.NEI],
}) => {
    return (
        <RadioGroup
            value={vurdering?.svar || ''}
            legend={label}
            onChange={(e) => oppdaterVurdering({ ...vurdering, svar: e })}
            size="small"
        >
            <HStack gap="4">
                <Radio value={SvarJaNei.JA}>{svarJa}</Radio>
                <Radio value={SvarJaNei.NEI}>{svarNei}</Radio>
            </HStack>
        </RadioGroup>
    );
};

export default JaNeiVurdering;
