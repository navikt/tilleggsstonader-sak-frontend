import React from 'react';

import { Button, ButtonProps } from '@navikt/ds-react';

export default function SmallButton(props: ButtonProps) {
    return (
        <Button size="small" style={{ maxWidth: 'fit-content' }} {...props}>
            {props.children}
        </Button>
    );
}
