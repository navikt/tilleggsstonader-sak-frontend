import React from 'react';

import { BorderAccentSubtle } from '@navikt/ds-tokens/js';

import styles from './Skillelinje.module.css';

export const Skillelinje: React.FC<React.HTMLAttributes<HTMLHRElement>> = (props) => {
    return (
        <hr
            {...props}
            className={`${styles.skillelinje} ${props.className ?? ''}`}
            style={
                {
                    '--border-color': BorderAccentSubtle,
                    ...props.style,
                } as React.CSSProperties
            }
        />
    );
};

export const SkillelinjeVertikal: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <div
            {...props}
            className={`${styles.skillelinjeVertikal} ${props.className ?? ''}`}
            style={
                {
                    '--border-color': BorderAccentSubtle,
                    ...props.style,
                } as React.CSSProperties
            }
        />
    );
};
