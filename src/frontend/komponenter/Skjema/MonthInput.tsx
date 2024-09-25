import React, { ReactNode } from 'react';

import { MonthPicker, useMonthpicker } from '@navikt/ds-react';

import { nullableTilDato, tilLocaleDateString } from '../../utils/dato';

export interface MonthInputProps {
    feil?: ReactNode;
    hideLabel?: boolean;
    label: string;
    onChange: (dato?: string) => void;
    size?: 'small' | 'medium';
    value?: string;
    readOnly?: boolean;
}

const MonthInput: React.FC<MonthInputProps> = ({
    feil,
    hideLabel,
    label,
    onChange,
    size,
    value,
    readOnly = false,
}) => {
    const { monthpickerProps, inputProps } = useMonthpicker({
        defaultSelected: nullableTilDato(value),
        onMonthChange: (val) => onChange(val ? tilLocaleDateString(val) : val),
    });

    return (
        <MonthPicker {...monthpickerProps}>
            <MonthPicker.Input
                {...inputProps}
                label={label}
                hideLabel={hideLabel}
                error={feil}
                size={size}
                readOnly={readOnly}
            />
        </MonthPicker>
    );
};

export default MonthInput;
