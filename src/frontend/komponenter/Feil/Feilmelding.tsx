import React, { ReactNode } from 'react';

import { Alert, ErrorMessage } from '@navikt/ds-react';

interface Props {
    children: ReactNode | undefined;
    variant?: 'inline' | 'alert';
    size?: 'small' | 'medium';
}

export const Feilmelding = React.forwardRef<HTMLDivElement | HTMLParagraphElement, Props>(
    function Feilmelding({ children, variant, size }, ref) {
        if (!children) {
            return null;
        }

        switch (variant) {
            case 'alert':
                return (
                    <Alert ref={ref} variant="error" size={size}>
                        {children}
                    </Alert>
                );

            case 'inline':
            default:
                return (
                    <ErrorMessage ref={ref} size={size}>
                        {children}
                    </ErrorMessage>
                );
        }
    }
);
