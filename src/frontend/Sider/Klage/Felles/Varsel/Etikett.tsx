import { Tag } from '@navikt/ds-react';
import React, { FC } from 'react';

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

export const EtikettSuksess: FC<EtikettProps> = ({ children }) => (
    <Tag variant={'success'} size={size}>
        {children}
    </Tag>
);
