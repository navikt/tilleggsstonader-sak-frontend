import { ReactNode } from 'react';
import React from 'react';

import { Alert, ErrorMessage } from '@navikt/ds-react';

export const Feilmelding: React.FC<{
    children: ReactNode | undefined;
    variant?: 'inline' | 'alert';
}> = ({ children, variant }) => {
    if (!children) {
        return null;
    }

    switch (variant) {
        case 'alert':
            return <Alert variant="error">{children}</Alert>;

        case 'inline':
        default:
            return <ErrorMessage>{children}</ErrorMessage>;
    }
};
