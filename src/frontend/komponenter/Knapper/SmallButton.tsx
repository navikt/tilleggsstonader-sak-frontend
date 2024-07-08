import React from 'react';

import { Button, ButtonProps } from '@navikt/ds-react';

const SmallButton = (props: ButtonProps) => {
    return (
        <Button size="small" style={{ maxWidth: 'fit-content' }} {...props}>
            {props.children}
        </Button>
    );
};

export default SmallButton;
