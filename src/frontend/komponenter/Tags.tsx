import React from 'react';

import { Tag } from '@navikt/ds-react';

export const SmallWarningTag = (props: { children: React.ReactNode }) => (
    <Tag data-color="warning" size="small" variant={'outline'} style={{ maxWidth: 'fit-content' }}>
        {props.children}
    </Tag>
);

export const SmallErrorTag = (props: { children: React.ReactNode }) => (
    <Tag data-color="danger" size="small" variant={'outline'} style={{ maxWidth: 'fit-content' }}>
        {props.children}
    </Tag>
);
