import React, { ReactNode } from 'react';

import { Alert, ErrorMessage } from '@navikt/ds-react';

interface Props {
    children: ReactNode | undefined;
    variant?: 'inline' | 'alert';
}

export const Feilmelding = React.forwardRef<HTMLDivElement | HTMLParagraphElement, Props>(
    ({ children, variant }, ref) => {
        if (!children) {
            return null;
        }

        switch (variant) {
            case 'alert':
                return (
                    <Alert ref={ref} variant="error">
                        {children}
                    </Alert>
                );

            case 'inline':
            default:
                return <ErrorMessage ref={ref}>{children}</ErrorMessage>;
        }
    }
);
