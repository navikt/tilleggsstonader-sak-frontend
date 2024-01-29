import React, { FC } from 'react';

import { Select as AkselSelect, SelectProps as AkselSelectProps } from '@navikt/ds-react';

import Lesefelt from './Lesefelt';

export interface SelectProps extends AkselSelectProps {
    erLesevisning: boolean;
    lesevisningVerdi?: string;
}

const Select: FC<SelectProps> = ({
    children,
    className,
    erLesevisning = false,
    label,
    lesevisningVerdi,
    value,
    size,
    hideLabel,
    ...props
}) => {
    return erLesevisning ? (
        <Lesefelt
            label={!hideLabel && label}
            verdi={lesevisningVerdi ? lesevisningVerdi : value}
            className={className}
            size={size}
        />
    ) : (
        <AkselSelect
            className={className}
            label={label}
            value={value}
            size={size}
            hideLabel={hideLabel}
            {...props}
        >
            {children}
        </AkselSelect>
    );
};

export default Select;
