import React from 'react';

import { Radio, RadioGroup, Textarea } from '@navikt/ds-react';

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
        <>
            <RadioGroup
                value={vurdering?.svar}
                legend={label}
                onChange={(e) => oppdaterVurdering({ ...vurdering, svar: e })}
                size="small"
            >
                <Radio value={SvarJaNei.JA}>{svarJa}</Radio>
                <Radio value={SvarJaNei.NEI}>{svarNei}</Radio>
            </RadioGroup>
            <Textarea
                value={vurdering?.begrunnelse}
                onChange={(e) => oppdaterVurdering({ ...vurdering, begrunnelse: e.target.value })}
                label="Begrunnelse"
                size="small"
            />
        </>
    );
};

export default JaNeiVurdering;
