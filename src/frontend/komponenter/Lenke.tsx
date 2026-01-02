import React from 'react';

import { Link, LinkProps } from '@navikt/ds-react';
import { BgMetaPurpleStrong } from '@navikt/ds-tokens/darkside-js';

import styles from './Lenke.module.css';

export const Lenke: React.FC<LinkProps> = (props) => {
    return (
        <Link
            {...props}
            className={`${styles.lenke} ${props.className ?? ''}`}
            style={
                {
                    '--visited-color': BgMetaPurpleStrong,
                    ...props.style,
                } as React.CSSProperties
            }
        />
    );
};
