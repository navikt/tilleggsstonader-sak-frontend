import React, { FC } from 'react';

import { Tag } from '@navikt/ds-react';

const size = 'small';

interface EtikettProps {
    children: React.ReactNode;
}

export const EtikettAdvarsel: FC<EtikettProps> = ({ children }) => (
    <Tag variant={'error'} size={size}>
        {children}
    </Tag>
);

export const EtikettFokus: FC<EtikettProps> = ({ children }) => (
    <Tag variant={'warning'} size={size}>
        {children}
    </Tag>
);
