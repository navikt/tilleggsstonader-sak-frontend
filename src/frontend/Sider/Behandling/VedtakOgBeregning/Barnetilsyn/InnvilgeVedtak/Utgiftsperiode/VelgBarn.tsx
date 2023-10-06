import React, { FC } from 'react';

import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import { Barn } from '../../../../vilkår';

interface Props {
    barn: Barn[];
    oppdaterUtgiftsperiodeElement: (value: string[]) => void;
    feil?: string;
}

const VelgBarn: FC<Props> = ({ barn, oppdaterUtgiftsperiodeElement, feil }) => {
    const handleChange = (avhukedeBarn: string[]) => oppdaterUtgiftsperiodeElement(avhukedeBarn);

    return (
        <CheckboxGroup
            legend="Velg barn"
            hideLegend
            onChange={(val: string[]) => handleChange(val)}
            error={feil}
        >
            {barn.map((barn, indeks) => (
                <Checkbox value={barn.barnId} key={indeks}>
                    {barn.registergrunnlag.navn}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
};

export default VelgBarn;
