import React from 'react';

import DateInput, { DateInputProps } from './DateInput';
import Lesefelt from './Lesefelt';
import { formaterDato } from '../../utils/dato';

export interface Props extends DateInputProps {
    className?: string;
    erLesevisning?: boolean;
    defaultMonth?: Date;
}

const DateInputMedLeservisning: React.FC<Props> = ({
    className,
    erLesevisning = false,
    hideLabel,
    label,
    size,
    value,
    defaultMonth,
    ...props
}) => {
    return erLesevisning ? (
        <Lesefelt
            className={className}
            label={label}
            hideLabel={hideLabel}
            verdi={formaterDato(value)}
            size={size}
        />
    ) : (
        <DateInput
            {...props}
            label={label}
            hideLabel={hideLabel}
            value={value}
            size={size}
            defaultMonth={defaultMonth}
        />
    );
};

export default DateInputMedLeservisning;
