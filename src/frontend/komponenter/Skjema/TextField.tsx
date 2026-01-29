import React, { FC } from 'react';

import {
    TextField as AkselTextField,
    TextFieldProps as AkselTextFieldProps,
} from '@navikt/ds-react';

import Lesefelt from './Lesefelt';

export interface TextFieldProps extends AkselTextFieldProps {
    erLesevisning?: boolean;
    lesevisningVerdi?: string;
}

const TextField: FC<TextFieldProps> = ({
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
        <AkselTextField
            className={className}
            label={label}
            value={value}
            size={size}
            hideLabel={hideLabel}
            autoComplete="off"
            {...props}
        />
    );
};

export default TextField;
