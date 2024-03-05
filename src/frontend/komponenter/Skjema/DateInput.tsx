import React, { ReactNode, useEffect } from 'react';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import { nullableTilDato, tilDato, tilLocaleDateString } from '../../utils/dato';

export interface DateInputProps {
    feil?: ReactNode;
    hideLabel?: boolean;
    label: string;
    onChange: (dato?: string) => void;
    size?: 'small' | 'medium';
    value?: string;
}

const DateInput: React.FC<DateInputProps> = ({ feil, hideLabel, label, onChange, size, value }) => {
    const { datepickerProps, inputProps, setSelected, selectedDay } = useDatepicker({
        defaultSelected: nullableTilDato(value),
        onDateChange: (val) => onChange(val ? tilLocaleDateString(val) : val),
    });

    useEffect(() => {
        const date = value ? tilDato(value) : undefined;
        if (date !== selectedDay) {
            setSelected(date);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                label={label}
                hideLabel={hideLabel}
                error={feil}
                size={size}
            />
        </DatePicker>
    );
};

export default DateInput;
