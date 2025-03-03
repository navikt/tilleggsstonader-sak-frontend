import React from 'react';

import { Tag } from '@navikt/ds-react';

export const SmallWarningTag = (props: { children: React.ReactNode }) => (
    <Tag size="small" variant={'warning'} style={{ maxWidth: 'fit-content' }}>
        {props.children}
    </Tag>
);

export const SmallErrorTag = (props: { children: React.ReactNode }) => (
    <Tag size="small" variant={'error'} style={{ maxWidth: 'fit-content' }}>
        {props.children}
    </Tag>
);
