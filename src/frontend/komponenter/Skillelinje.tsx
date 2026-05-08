import React from 'react';

import { BorderAccentSubtle } from '@navikt/ds-tokens/js';

import styles from './Skillelinje.module.css';
import { classNames } from '../utils/classNames';

interface SkillelinjeProps extends React.HTMLAttributes<HTMLHRElement> {
    utenMargin?: boolean;
}

export const Skillelinje: React.FC<SkillelinjeProps> = ({ utenMargin = false, ...props }) => {
    return (
        <hr
            {...props}
            className={classNames([
                styles.skillelinje,
                props.className ?? '',
                utenMargin ? styles.utenMargin : '',
            ])}
            style={
                {
                    '--border-color': BorderAccentSubtle,
                    ...props.style,
                } as React.CSSProperties
            }
        />
    );
};
