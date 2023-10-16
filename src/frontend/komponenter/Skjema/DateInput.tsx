import React, { ReactNode } from 'react';

import { DatePicker, useDatepicker } from '@navikt/ds-react';

import Lesefelt from './Lesefelt';
import { nullableTilDato, tilLocaleDateString } from '../../utils/dato';

export interface Props {
    className?: string;
    erLesevisning?: boolean;
    feil?: ReactNode;
    hideLabel?: boolean;
    label?: string;
    onChange: (dato?: string) => void;
    size?: 'small' | 'medium';
    value?: string;
}

const DateInput: React.FC<Props> = ({
    className,
    erLesevisning = false,
    feil,
    hideLabel,
    label,
    onChange,
    size,
    value,
}) => {
    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        defaultSelected: nullableTilDato(value),
        onDateChange: (val) => onChange(val ? tilLocaleDateString(val) : val),
    });

    return erLesevisning ? (
        <Lesefelt
            className={className}
            label={label}
            hideLabel={hideLabel}
            verdi={selectedDay?.toDateString()}
        />
    ) : (
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
