import React from 'react';

import Lesefelt from './Lesefelt';
import MonthInput, { MonthInputProps } from './MonthInput';
import { formaterNullableÅrMåned } from '../../utils/dato';

export interface Props extends MonthInputProps {
    className?: string;
    erLesevisning?: boolean;
}

const MonthInputMedLeservisning: React.FC<Props> = ({
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
            verdi={formaterNullableÅrMåned(value)}
            size={size}
        />
    ) : (
        <MonthInput {...props} label={label} hideLabel={hideLabel} value={value} size={size} />
    );
};

export default MonthInputMedLeservisning;
