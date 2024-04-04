import React from 'react';

import { Tag } from '@navikt/ds-react';

export default function SmallWarningTag(props: { children: React.ReactNode }) {
    return (
        <Tag size="small" variant={'warning'} style={{ maxWidth: 'fit-content' }}>
            {props.children}
        </Tag>
    );
}
