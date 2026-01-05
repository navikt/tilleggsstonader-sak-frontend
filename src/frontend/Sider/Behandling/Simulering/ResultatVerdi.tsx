import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './ResultatVerdi.module.css';

/**
 * Komponent for å vise en verdi med farge rød eller grønn basert på om verdien er positiv eller negativ.
 */
export const ResultatVerdi = ({
    verdi,
    children,
}: {
    verdi: number;
    children: React.ReactNode;
}) => {
    const tekstfarge = verdi ? (verdi > 0 ? styles.success : styles.danger) : '';

    return <BodyShort className={tekstfarge}>{children}</BodyShort>;
};
