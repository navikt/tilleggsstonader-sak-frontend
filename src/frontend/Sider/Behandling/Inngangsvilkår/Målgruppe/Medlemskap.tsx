import React from 'react';

import { Radio, RadioGroup, Textarea } from '@navikt/ds-react';

import { MålgrupperMedMedlemskapsvurdering, svarJaMappingMedlemskap } from './utils';
import { SvarJaNei, Vurdering } from '../typer/vilkårperiode';

const Medlemskap: React.FC<{
    medlemskap?: Vurdering;
    oppdaterMedlemskap: (vurdering: Vurdering) => void;
    målgruppeType: MålgrupperMedMedlemskapsvurdering;
}> = ({ medlemskap, oppdaterMedlemskap, målgruppeType }) => {
    return (
        <>
            <RadioGroup
                value={medlemskap?.svar}
                legend="Medlem"
                onChange={(e) => oppdaterMedlemskap({ ...medlemskap, svar: e.target.value })}
                size="small"
            >
                <Radio value={SvarJaNei.JA}>{svarJaMappingMedlemskap[målgruppeType]}</Radio>
                <Radio value={SvarJaNei.NEI}>{svarJaMappingMedlemskap[målgruppeType]}</Radio>
            </RadioGroup>
            <Textarea
                value={medlemskap?.begrunnelse}
                onChange={(e) => oppdaterMedlemskap({ ...medlemskap, begrunnelse: e.target.value })}
                label="Begrunnelse"
                size="small"
            />
        </>
    );
};

export default Medlemskap;
