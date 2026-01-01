import React from 'react';

import { Table } from '@navikt/ds-react';

import styles from './VedtaksperioderBorderTable.module.css';

export const BorderTable = ({
    $border,
    className,
    ...props
}: React.ComponentProps<typeof Table> & { $border?: boolean }) => (
    <Table
        className={`${styles.borderTable} ${$border ? styles.border : ''} ${className || ''}`}
        {...props}
    />
);
