import React, { FC } from 'react';

import { Select, SelectProps } from '@navikt/ds-react';

export interface SelectOption {
    value: string;
    label: string;
}

interface Props extends Omit<SelectProps, 'children' | 'readOnly'> {
    valg: SelectOption[];
    erLesevisning: boolean;
}

const SelectMedOptions: FC<Props> = ({ valg, erLesevisning, ...props }) => {
    return (
        <Select {...props} readOnly={erLesevisning}>
            <option value="">Velg</option>
            {valg.map((v) => (
                <option key={v.value} value={v.value}>
                    {v.label}
                </option>
            ))}
        </Select>
    );
};

export default SelectMedOptions;
