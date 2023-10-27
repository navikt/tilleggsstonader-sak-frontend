import { ReactNode } from 'react';
import React from 'react';

import { ErrorMessage } from '@navikt/ds-react';

export const Feilmelding: React.FC<{ children: ReactNode | undefined }> = ({ children }) =>
    children ? <ErrorMessage>{children}</ErrorMessage> : null;
