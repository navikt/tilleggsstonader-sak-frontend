import React from 'react';

import { CopyButton } from '@navikt/ds-react';

import styles from './Fødselsnummer.module.css';

export const Fødselsnummer: React.FC<{ fødselsnummer: string }> = ({ fødselsnummer }) => {
    return (
        <span className={styles.noWrapSpan}>
            <span>{formaterFødselsnummer(fødselsnummer)}</span>
            <CopyButton
                size={'xsmall'}
                copyText={fødselsnummer}
                variant={'action'}
                activeText={'kopiert'}
            />
        </span>
    );
};

const formaterFødselsnummer = (fødselsnummer: string): string =>
    fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6);
