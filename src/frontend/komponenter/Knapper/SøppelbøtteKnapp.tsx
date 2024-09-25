import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';

export const SøppelbøtteKnapp = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'icon'>>(
    ({ children, size = 'small', variant = 'tertiary', ...restProps }, ref) => {
        return (
            <Button
                icon={<TrashIcon title="Fjern" />}
                size={size}
                variant={variant}
                ref={ref}
                {...restProps}
            >
                {children}
            </Button>
        );
    }
);

// Set displayName for easier debugging
SøppelbøtteKnapp.displayName = 'SøppelbøtteKnapp';
