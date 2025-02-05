import React from 'react';

import DateInput, { DateInputProps } from './DateInput';
import Lesefelt from './Lesefelt';
import { formaterDato } from '../../utils/dato';

export interface Props extends DateInputProps {
    className?: string;
    erLesevisning?: boolean;
}

const DateInputMedLeservisning: React.FC<Props> = ({
    className,
    erLesevisning = false,
    hideLabel,
    label,
    size,
    value,
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
            className={className}
            label={label}
            hideLabel={hideLabel}
            value={value}
            size={size}
        />
    );
};

export default DateInputMedLeservisning;
