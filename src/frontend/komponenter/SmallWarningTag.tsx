import React from 'react';

import { Tag } from '@navikt/ds-react';

const SmallWarningTag = (props: { children: React.ReactNode }) => (
    <Tag size="small" variant={'warning'} style={{ maxWidth: 'fit-content' }}>
        {props.children}
    </Tag>
);

export default SmallWarningTag;
