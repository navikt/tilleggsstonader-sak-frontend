import React from 'react';

import { Button, ButtonProps } from '@navikt/ds-react';

import styles from './SmallButton.module.css';

const SmallButton = (props: ButtonProps) => {
    return (
        <Button
            size="small"
            className={`${styles.smallButton} ${props.className ?? ''}`}
            {...props}
        >
            {props.children}
        </Button>
    );
};

export default SmallButton;
