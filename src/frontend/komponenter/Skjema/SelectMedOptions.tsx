import React, { FC } from 'react';

import Select, { SelectProps } from './Select';

export interface SelectOption {
    value: string;
    label: string;
}

interface Props extends Omit<SelectProps, 'children'> {
    valg: SelectOption[];
}

const SelectMedOptions: FC<Props> = ({ valg, ...props }) => {
    return (
        <Select {...props}>
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
