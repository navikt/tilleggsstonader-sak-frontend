import React, { ReactNode } from 'react';

import { Alert, ErrorMessage } from '@navikt/ds-react';

interface Props {
    children: ReactNode | undefined;
    variant?: 'inline' | 'alert';
    id?: string;
}

export const Feilmelding = React.forwardRef<HTMLDivElement | HTMLParagraphElement, Props>(
    ({ children, variant, id }, ref) => {
        if (!children) {
            return null;
        }

        switch (variant) {
            case 'alert':
                return (
                    <Alert id={id} ref={ref} variant="error">
                        {children}
                    </Alert>
                );

            case 'inline':
            default:
                return (
                    <ErrorMessage id={id} ref={ref}>
                        {children}
                    </ErrorMessage>
                );
        }
    }
);
