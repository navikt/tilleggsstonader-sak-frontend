import React, { FC } from 'react';

import Select, { SelectProps } from './Select';

export interface SelectOption {
    value: string;
    label: string;
}

interface Props extends Omit<SelectProps, 'children' | 'erLeservisning' | 'readOnly'> {
    valg: SelectOption[];
    erLeservisning?: boolean;
    readOnlyLeservisning?: boolean;
}

const SelectMedOptions: FC<Props> = ({
    valg,
    erLesevisning,
    readOnlyLeservisning = false,
    ...props
}) => {
    return (
        <Select
            erLesevisning={erLesevisning && !readOnlyLeservisning}
            readOnly={erLesevisning && readOnlyLeservisning}
            {...props}
        >
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
