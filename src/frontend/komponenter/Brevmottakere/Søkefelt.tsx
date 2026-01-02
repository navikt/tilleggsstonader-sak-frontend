import React from 'react';

import { TextField } from '@navikt/ds-react';

import styles from './Søkefelt.module.css';
import { classNames } from '../../utils/classNames';

type TextFieldProps = React.ComponentProps<typeof TextField>;

export const Søkefelt: React.FC<TextFieldProps> = ({ className, ...rest }) => (
    <TextField {...rest} className={classNames([styles.søkefelt, className])} />
);
