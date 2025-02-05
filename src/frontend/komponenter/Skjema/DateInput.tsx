import React, { ReactNode } from 'react';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import { nullableTilDato, tilLocaleDateString } from '../../utils/dato';

export interface DateInputProps {
    feil?: ReactNode;
    hideLabel?: boolean;
    label: string;
    onChange: (dato?: string) => void;
    size?: 'small' | 'medium';
    value?: string;
    readOnly?: boolean;
    fromDate?: Date;
    toDate?: Date;
    className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
    feil,
    hideLabel,
    label,
    onChange,
    size,
    value,
    readOnly = false,
    fromDate,
    toDate,
    className,
}) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(value),
        onDateChange: (val) => onChange(val ? tilLocaleDateString(val) : val),
        fromDate: fromDate,
        toDate: toDate,
    });

    return (
        <DatePicker {...datepickerProps} className={className}>
            <DatePicker.Input
                {...inputProps}
                label={label}
                hideLabel={hideLabel}
                error={feil}
                size={size}
                readOnly={readOnly}
            />
        </DatePicker>
    );
};

export default DateInput;
